const Stripe = require("stripe");
require("dotenv").config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const towingController = async (req, res) => {
    try {
        const { carBody, amount } = req.body;

        if (!carBody || !amount) {
            return res.status(400).json({ error: "Missing required parameters." });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Towing Service - ${carBody}`,
                        },
                        unit_amount: amount * 100, // Convert to paise (INR)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/successful`,
            cancel_url: `${process.env.FRONTEND_URL}/cancelled`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};

module.exports = towingController;
