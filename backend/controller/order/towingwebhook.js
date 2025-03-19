const stripe = require("../../config/stripe");
const TowingOrder = require("../../models/towingOrder");
const endpointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;

const towingWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const towingOrder = new TowingOrder({
      carBody: session.metadata?.carBody || "Unknown",
      amount: session.amount_total / 100, // Convert to INR
      email: session.customer_email,
      paymentId: session.payment_intent,
      paymentMethod: session.payment_method_types?.[0] || "Unknown",
      paymentStatus: session.payment_status,
    });

    try {
      await towingOrder.save();
      console.log(" Towing Order Saved:", towingOrder);
    } catch (error) {
      console.error(" Error saving towing order:", error);
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send();
};

module.exports = towingWebhook;
