import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImageUploader from "../components/ImageUploader";
import { CheckoutForm } from '../components/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Modal } from 'react-bootstrap';
import fotobackground from '../assets/img/fotobackground.jpeg';
import '../index.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const DetailCat = () => {
    const [cat, setCat] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { cat_id } = useParams();
    const [mostrarPago, setMostrarPago] = useState(false);
    const token = localStorage.getItem('token');
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState('EUR');

    const isLoggedIn = token && token !== 'null' && token !== 'undefined';

    const handlePostSponsor = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error('Backend error');
            await fetch(`/api/payment-registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    cat_id,
                    date_payment: new Date().toISOString()
                })
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePaymentSuccess = () => {
        handlePostSponsor();
        setMostrarPago(false);
    };

    useEffect(() => {
        const handleGetCat = async () => {
            try {
                setCargando(true);
                setError(null);
                const backendUrl = import.meta.env.VITE_BACKEND_URL;
                if (!backendUrl) throw new Error('Backend error');
                const response = await fetch(`/api/cat/${cat_id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) throw new Error(`Error`);
                const data = await response.json();
                setCat(data.Cat);
            } catch (err) {
                setError('Error cargando el gato: ' + err.message);
                console.error('Error:', err);
            } finally {
                setCargando(false);
            }
        };
        handleGetCat();
    }, [cat_id]);

    if (!cat) return null;

    return (
        <div
            style={{
                backgroundImage: `url(${fotobackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100vh",
                padding: "2rem 1rem",
                display: "flex",
                justifyContent: "center"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "2rem",
                    width: "100%",
                    maxWidth: 900,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    borderRadius: "12px",
                    padding: "2rem"
                }}
            >
                {/* Texto */}
                <div style={{ width: "100%", textAlign: "center" }}>
                    <h1 className="fw-bolder">{cat.name}</h1>
                    <hr className="my-4" />
                    <p className="text-justify">{cat.history}</p>
                    <hr className="my-4" />
                    <p><strong>Edad:</strong> {cat.age}</p>
                    <p><strong>Raza:</strong> {cat.race}</p>
                    <p><strong>Castración:</strong> {cat.castration ? 'SI' : 'NO'}</p>
                    <p><strong>Carácter:</strong> {cat.character}</p>
                </div>

                {/* Imagen */}
                <div
                    style={{
                        width: "90%",
                        maxWidth: 300,
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                        borderRadius: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <ImageUploader
                        idImage={cat.image}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                        }}
                    />
                </div>

                {/* Botón de donación */}
                {isLoggedIn ? (
                    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                        <button
                            onClick={() => setMostrarPago(true)}
                            style={{
                                padding: "0.75rem 1.5rem",
                                fontSize: "1rem",
                                borderRadius: "8px",
                                border: "none",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Donar
                        </button>
                        <Modal show={mostrarPago} onHide={() => setMostrarPago(false)} centered>
                            <Modal.Header closeButton>
                                <Modal.Title>Donar</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Elements stripe={stripePromise}>
                                    <CheckoutForm
                                        amount={amount}
                                        setAmount={setAmount}
                                        currency={currency}
                                        setCurrency={setCurrency}
                                        onPaymentSuccess={handlePaymentSuccess}
                                    />
                                </Elements>
                            </Modal.Body>
                        </Modal>
                    </div>
                ) : (
                    <h3 className="text-center mt-3">
                        <strong>Por favor inicia sesión o registrate para donar.</strong>
                    </h3>
                )}
            </div>
        </div>
    );
};

