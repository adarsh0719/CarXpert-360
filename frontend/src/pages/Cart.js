import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from 'react-icons/md';
import { loadStripe } from '@stripe/stripe-js';

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const context = useContext(Context);
    const loadingCart = new Array(4).fill(null);

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    const handleLoading = async () => {
        await fetchData();
    };

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const increaseQty = async (id, qty) => {
        const response = await fetch(SummaryApi.updateCartProduct.url, {
            method: SummaryApi.updateCartProduct.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                _id: id,
                quantity: qty + 1,
            }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            fetchData();
        }
    };

    const decraseQty = async (id, qty) => {
        if (qty >= 2) {
            const response = await fetch(SummaryApi.updateCartProduct.url, {
                method: SummaryApi.updateCartProduct.method,
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    _id: id,
                    quantity: qty - 1,
                }),
            });

            const responseData = await response.json();

            if (responseData.success) {
                fetchData();
            }
        }
    };

    const deleteCartProduct = async (id) => {
        const response = await fetch(SummaryApi.deleteCartProduct.url, {
            method: SummaryApi.deleteCartProduct.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                _id: id,
            }),
        });

        const responseData = await response.json();

        if (responseData.success) {
            fetchData();
            context.fetchUserAddToCart();
        }
    };

    const handlePayment = async () => {
        const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
        const response = await fetch(SummaryApi.payment.url, {
            method: SummaryApi.payment.method,
            credentials: 'include',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                cartItems: data,
            }),
        });

        const responseData = await response.json();

        if (responseData?.id) {
            stripePromise.redirectToCheckout({ sessionId: responseData.id });
        }
    };

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = data.reduce((preve, curr) => preve + curr.quantity * curr?.productId?.sellingPrice, 0);

    return (
        <div className="container mx-auto p-4 md:p-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-700">Your Shopping Cart</h1>

            <div className="flex flex-col lg:flex-row gap-6 md:gap-10">
                {/*** Product List */}
                <div className="w-full lg:w-3/4">
                    {loading ? (
                        loadingCart.map((_, index) => (
                            <div
                                key={`loading-${index}`}
                                className="w-full bg-gray-200 h-24 md:h-32 my-2 md:my-4 rounded-lg animate-pulse"
                            ></div>
                        ))
                    ) : data.length > 0 ? (
                        data.map((product) => (
                            <div
                                key={product?._id}
                                className="flex items-center bg-white shadow-lg rounded-lg overflow-hidden mb-3 md:mb-4 p-2 md:p-0"
                            >
                                <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 overflow-hidden flex-shrink-0">
                                    <img
                                        src={product?.productId?.productImage[0]}
                                        alt={product?.productId?.productName}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-2 md:p-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-base md:text-lg font-bold text-gray-800">
                                            {product?.productId?.productName}
                                        </h2>
                                        <button
                                            onClick={() => deleteCartProduct(product?._id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <MdDelete className="text-xl md:text-2xl" />
                                        </button>
                                    </div>
                                    <p className="text-xs md:text-sm text-gray-500 capitalize mt-1">
                                        {product?.productId?.category}
                                    </p>
                                    <div className="flex justify-between mt-2">
                                        <p className="text-base md:text-lg text-red-600 font-semibold">
                                            {displayINRCurrency(product?.productId?.sellingPrice)}
                                        </p>
                                        <p className="text-base md:text-lg text-gray-700 font-bold">
                                            {displayINRCurrency(
                                                product?.productId?.sellingPrice * product?.quantity
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center mt-2 md:mt-4 gap-2 md:gap-3">
                                        <button
                                            onClick={() => decraseQty(product?._id, product?.quantity)}
                                            className="w-7 h-7 md:w-8 md:h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="text-gray-800 text-sm md:text-base">{product?.quantity}</span>
                                        <button
                                            onClick={() => increaseQty(product?._id, product?.quantity)}
                                            className="w-7 h-7 md:w-8 md:h-8 border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600 py-6 md:py-10">Your cart is empty.</p>
                    )}
                </div>

                {/*** Summary */}
                {data.length > 0 && (
                    <div className="w-full lg:w-1/4">
                        <div className="bg-white shadow-lg rounded-lg p-4 md:p-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-700 mb-3 md:mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-2">
                                <p className="text-sm md:text-base text-gray-600">Total Quantity</p>
                                <p className="font-semibold text-gray-800">{totalQty}</p>
                            </div>
                            <div className="flex justify-between mb-4">
                                <p className="text-sm md:text-base text-gray-600">Total Price</p>
                                <p className="font-bold text-gray-800">
                                    {displayINRCurrency(totalPrice)}
                                </p>
                            </div>
                            <button
                                onClick={handlePayment}
                                className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition text-sm md:text-base"
                            >
                                Proceed to Payment
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;