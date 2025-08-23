// Netlify Function: Stripe Webhook (server-confirmed order email)
// Env vars required on Netlify: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  // Stripe sends a signature header so we can verify the payload wasn't modified
  const sig = event.headers["stripe-signature"];

  // Netlify may base64-encode the body; handle both cases
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed.", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // We only need checkout.session.completed for this site
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;

    // Optional: fetch line items (helps when you change pricing later)
    let items = [];
    try {
      const li = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
      items = li.data.map(
        (i) =>
          `${i.quantity} × ${i.description} — $${(i.amount_total / 100).toFixed(2)} ${i.currency.toUpperCase()}`,
      );
    } catch (e) {
      console.warn("Could not fetch line items:", e.message);
    }

    const md = session.metadata || {}; // we set these in create-checkout.js
    const cd = session.customer_details || {}; // email, name, etc.
    const sd = session.shipping_details || {}; // shipping address

    const html = `
      <div style="font-family:Inter,Arial,sans-serif">
        <h2>Stripe Payment Succeeded — The Slab Station</h2>
        <p><b>Checkout Session:</b> ${session.id}</p>
        <p><b>Email:</b> ${cd.email || ""}</p>
        <p><b>Total:</b> $${(session.amount_total / 100).toFixed(2)} ${session.currency?.toUpperCase() || "AUD"}</p>

        <h3>Order</h3>
        <ul>
          <li><b>Grading:</b> ${md.grading || ""}</li>
          <li><b>Style:</b> ${md.style || ""}</li>
          ${md.addon ? `<li><b>Add-ons:</b> ${md.addon}</li>` : ""}
          ${md.custom ? `<li><b>Custom:</b> ${md.custom}</li>` : ""}
          ${md.customNotes ? `<li><b>Notes:</b> ${md.customNotes}</li>` : ""}
        </ul>

        ${items.length ? `<p><b>Items:</b><br>${items.join("<br>")}</p>` : ""}

        ${
          sd?.address
            ? `
          <h3>Shipping</h3>
          <ul>
            <li><b>Name:</b> ${sd.name || ""}</li>
            <li><b>Address:</b> ${sd.address.line1 || ""}${sd.address.line2 ? ", " + sd.address.line2 : ""}</li>
            <li><b>City:</b> ${sd.address.city || ""}</li>
            <li><b>State:</b> ${sd.address.state || ""}</li>
            <li><b>Postcode:</b> ${sd.address.postal_code || ""}</li>
            <li><b>Country:</b> ${sd.address.country || ""}</li>
          </ul>`
            : ""
        }
      </div>
    `;

    // Send the order email to you
    await resend.emails.send({
      from: "orders@slabstation.app", // add/verify sender in your Resend account
      to: "theaaronhughes@gmail.com",
      subject: `Paid — Stripe Checkout ${session.id}`,
      html,
    });
  }

  // Always return 200 or Stripe will retry
  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
