import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer";


export const CheckoutForm = ({ amount, setAmount, currency, setCurrency, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('')
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false)
    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer();

    useEffect(() => {
        if (amount <= 0 || currency === "")
            return;
        const paymentIntent = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error('Backend error')

            const res = await fetch(`${backendUrl}/api/create-checkout-session`, {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ amount: parseInt(amount) * 100, currency })

            })
            if (!res.ok) throw new Error(`Error ${res.status}`)
            const data = await res.json()
            setClientSecret(data.clientSecret)
        }
        paymentIntent()
    }, [amount, currency]);
    console.log(clientSecret)

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }
        setLoading(true);

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        },
        );
        setLoading(false)

        if (error) {
            console.log('[error]', error);
        } else if (paymentIntent.status === 'succeeded') {
            console.log('Payment succeeded')
            setPaymentSuccess(true);


            if (onPaymentSuccess) {
                onPaymentSuccess();
            }

            setTimeout(() => navigate('/'), 2000);
        } else {
            console.log('algun error')
        };

    }
    return (
        <form
            className="w-75 mx-auto p-4 rounded-4 shadow-lg"
            style={{ backgroundColor: "#f0f6ff" }}
            onSubmit={handleSubmit}
        >
            <div className="mb-4 mx-auto col-6">
                <label
                    htmlFor="amount"
                    className="form-label fw-semibold"
                    style={{ color: "#0d6efd" }}
                >
                    Amount
                </label>
                <input
                    id="amount"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control rounded-pill border-2 border-primary"
                    style={{
                        backgroundColor: "#fff",
                        color: "#0d6efd",
                        fontWeight: "600",
                    }}
                />
            </div>

            <div className="mb-4 mx-auto col-6">
                <label
                    htmlFor="currency"
                    className="form-label fw-semibold"
                    style={{ color: "#0d6efd" }}
                >
                    Moneda
                </label>
                <select
                    id="currency"
                    value={currency}
                    onChange={(e) => {
                        const selectedCurrency = e.target.value;
                        setCurrency(selectedCurrency);
                        dispatch({ type: "divisa", payload: { currency: selectedCurrency } });
                    }}
                    className="form-select rounded-pill border-2 border-primary"
                    style={{ backgroundColor: "#fff", color: "#0d6efd", fontWeight: "600" }}
                >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="mxn">MXN</option>
                </select>
            </div>

            <div className="my-5">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#0d6efd",
                                fontWeight: "600",
                                "::placeholder": {
                                    color: "#a0b9ff",
                                },
                            },
                            invalid: {
                                color: "#ff4d4f",
                            },
                        },
                    }}
                />
            </div>

            <div className="d-flex justify-content-center">
                <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-5 py-2 shadow"
                    disabled={!stripe || loading}
                    style={{
                        backgroundColor: "#0d6efd",
                        border: "none",
                        fontWeight: "700",
                        fontSize: "1.1rem",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0048d0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0d6efd")}
                >
                    Pay
                </button>
            </div>

            {paymentSuccess && (
                <div
                    className="alert alert-success mt-4 rounded-3 text-center"
                    role="alert"
                    style={{ fontWeight: "600", color: "#0048d0", backgroundColor: "#d0e3ff" }}
                >
                    Su pago ha sido procesado. Redireccionando...
                </div>
            )}
        </form>
    );

};