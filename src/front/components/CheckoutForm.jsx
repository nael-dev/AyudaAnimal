import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { FaCreditCard } from "react-icons/fa";

export const CheckoutForm = ({ amount, setAmount, currency, setCurrency, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    useEffect(() => {
        if (amount <= 0 || !currency) return;

        const createPaymentIntent = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!backendUrl) throw new Error("Backend URL no definida");

                const res = await fetch(`${backendUrl}/api/create-checkout-session`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: parseInt(amount) * 100, currency }),
                });

                if (!res.ok) {
                    const text = await res.text(); // Por si llega HTML de error
                    throw new Error(`Error ${res.status}: ${text}`);
                }

                const data = await res.json();

                if (!data.clientSecret) {
                    console.error("Respuesta inválida del backend:", data);
                    setErrorMessage("No se pudo generar el pago. Intenta de nuevo más tarde.");
                    return;
                }

                setClientSecret(data.clientSecret);
                setErrorMessage('');
            } catch (err) {
                console.error("Error creando PaymentIntent:", err);
                setErrorMessage("Error conectando con el servidor. Intenta de nuevo más tarde.");
            }
        };

        createPaymentIntent();
    }, [amount, currency]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        if (!stripe || !elements) {
            setErrorMessage("Stripe no está listo. Intenta recargar la página.");
            return;
        }

        if (!clientSecret) {
            setErrorMessage("No se pudo generar el pago. Intenta de nuevo.");
            return;
        }

        setLoading(true);

        try {
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: elements.getElement(CardElement) },
            });

            if (error) {
                console.error("[Stripe error]", error);
                setErrorMessage(error.message || "Error en el pago.");
            } else if (paymentIntent.status === "succeeded") {
                setPaymentSuccess(true);
                if (onPaymentSuccess) onPaymentSuccess();
                setTimeout(() => navigate("/"), 2000);
            } else {
                setErrorMessage("El pago no se completó. Intenta nuevamente.");
            }
        } catch (err) {
            console.error("Error procesando el pago:", err);
            setErrorMessage("Error inesperado. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="mx-auto p-5 rounded-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #e3f2fd, #bbdefb)", maxWidth: "500px", marginTop: "60px" }}
            onSubmit={handleSubmit}
        >
            <div className="text-center mb-4">
                <FaCreditCard size={40} color="#0d6efd" />
                <h3 className="fw-bold text-primary mt-2">Pago Seguro</h3>
                <p className="text-muted">Introduce los datos de tu tarjeta para completar el pago</p>
            </div>

            <div className="mb-4">
                <label htmlFor="amount" className="form-label fw-semibold text-primary">Monto</label>
                <input
                    id="amount"
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="form-control rounded-3 border-2 border-primary"
                    style={{ fontWeight: "600" }}
                />
            </div>

            <div className="mb-4">
                <label htmlFor="currency" className="form-label fw-semibold text-primary">Moneda</label>
                <select
                    id="currency"
                    value={currency}
                    onChange={(e) => {
                        const selectedCurrency = e.target.value;
                        setCurrency(selectedCurrency);
                        dispatch({ type: "divisa", payload: { currency: selectedCurrency } });
                    }}
                    className="form-select rounded-3 border-2 border-primary fw-semibold"
                >
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                    <option value="mxn">MXN</option>
                </select>
            </div>

            <div className="my-4 p-3 rounded-3 border border-primary bg-white shadow-sm">
                <CardElement
                    options={{
                        style: {
                            base: { fontSize: "16px", color: "#0d6efd", fontWeight: "600", "::placeholder": { color: "#a0b9ff" } },
                            invalid: { color: "#ff4d4f" },
                        },
                    }}
                />
            </div>

            <div className="d-grid">
                <button
                    type="submit"
                    className="btn btn-primary btn-lg fw-bold shadow rounded-3"
                    disabled={!stripe || loading}
                    style={{ transition: "all 0.3s ease" }}
                >
                    {loading ? "Procesando..." : "Pagar"}
                </button>
            </div>

            {errorMessage && (
                <div className="alert alert-danger mt-4 text-center fw-semibold">{errorMessage}</div>
            )}

            {paymentSuccess && (
                <div className="alert alert-success mt-4 text-center fw-semibold">
                    ✅ Pago exitoso. Redirigiendo...
                </div>
            )}
        </form>
    );
};
