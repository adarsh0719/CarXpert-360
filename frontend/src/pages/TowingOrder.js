import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import SummaryApi from "../common";
import { toast } from "react-toastify";

const carPrices = {
  Hatchback: 300,
  Sedan: 1000,
  Coupe: 2000,
  SUV: 2000,
  MUV: 2500,
};

const TowingOrder = ({ distance }) => {
  const [carBody, setCarBody] = useState("");
  const [amount, setAmount] = useState(0);
  const [bodyPrice, setBodyPrice] = useState(0);
  const [distanceCharge, setDistanceCharge] = useState(0);

  useEffect(() => {
    if (carBody && distance !== null) {
      const basePrice = carPrices[carBody] || 0;
      const distanceCost = distance * 10;
      setBodyPrice(basePrice);
      setDistanceCharge(distanceCost);
      setAmount(basePrice + distanceCost);
    }
  }, [carBody, distance]);

  const handlePayment = async () => {
    try {
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
      const response = await fetch(SummaryApi.towingpayment.url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carBody,
          amount,
        }),
      });

      const session = await response.json();

      if (session.id) {
        await stripe.redirectToCheckout({ sessionId: session.id });
      } else {
        toast.error(session.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePayment();
  };

  return (
    <div className="flex justify-center items-center min-h-[50vh] md:min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-4 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-700">
          Towing Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-8">
            {/* Left Side: Car Body Selector */}
            <div className="w-full">
              <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                Select Car Body
              </label>
              <select
                value={carBody}
                onChange={(e) => setCarBody(e.target.value)}
                required
                className="w-full p-2 md:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm md:text-base"
              >
                <option value="">Choose an option</option>
                {Object.keys(carPrices).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Right Side: Charges */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold text-sm md:text-base">
                  Distance Charge:
                </p>
                <p className="text-sm md:text-base font-bold text-gray-900">₹{distanceCharge}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-semibold text-sm md:text-base">
                  Body Type Price:
                </p>
                <p className="text-sm md:text-base font-bold text-gray-900">₹{bodyPrice}</p>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <p className="text-gray-700 font-semibold text-base md:text-xl">
                  Total Amount:
                </p>
                <p className="text-lg md:text-2xl font-bold text-green-700">₹{amount}</p>
              </div>
            </div>
          </div>

          {/* Proceed Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 md:py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-sm md:text-base"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default TowingOrder;