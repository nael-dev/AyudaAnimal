import Carousel from "../components/Carousel.jsx";
import { Card } from "../components/Card.jsx";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import fotobackground from "../assets/img/fotobackground.jpeg";
import { loadStripe } from "@stripe/stripe-js";
import { Modal } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../components/CheckoutForm.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const Sponsorship = () => {
    const [cats, setCats] = useState([]);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("EUR");

     const handleGetCats = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("Backend error");
            const response = await fetch(`/api/cat`);
            if (!response.ok) throw new Error("Error al cargar gatos");
            const data = await response.json();
            setCats(data.cats);
        } catch (err) {
            console.error("Error:", err);
        }
    };

      const handlePostSponsor = async (catId) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            await fetch(`/api/payment-registration`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    amount,
                    currency,
                    cat_id: catId,
                    date_payment: new Date().toISOString(),
                }),
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };
     const handlePaymentSuccess = () => {
        if (selectedCat) {
            handlePostSponsor(selectedCat.id);
        }
        setMostrarPago(false);
    };

    useEffect(() => {
        handleGetCats();
    }, []);
    const LoggedIn = !!localStorage.getItem("token");

    return (
        <div className="p-4"
            style={{
                backgroundImage: `url(${fotobackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "800px"
            }}>

            <div className="content ">
                <h1 className="text-center p-2">Quieres apadrinar?</h1>
                <div className="container my-5" >
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="text-center p-4">
                            <h3 className="mb-3">🐾Apadrinar un gato es una forma hermosa y comprometida de ayudar sin necesidad de adoptar directamente.🐾</h3>
                            <p>Cuando apadrinas, estás brindando un apoyo vital que permite cubrir sus necesidades básicas como alimentación, atención veterinaria, vacunas y un refugio seguro.  </p>
                            <p>Gracias a tu donación, los gatitos rescatados reciben cuidados constantes que mejoran su calidad de vida y les dan la oportunidad de crecer sanos y felices mientras esperan un hogar definitivo.

                            </p>
                        </div>
                    </div>
                </div>
                < div className="p-5" >
                    <Carousel
                        cards={cats
                            .filter((catItem)=> !catItem.adopted)
                            .map((catItem) => (
                            <Card cat={catItem} key={catItem.id}>
                                {LoggedIn ? (
                                    <>
                                        <button
                                            className="btn btn-primary-custom mt-3 w-100"
                                            onClick={() => {
                                                setSelectedCat(catItem);
                                                setMostrarPago(true);
                                            }}
                                        >
                                            Donar
                                        </button>

                                        <Modal show={mostrarPago} onHide={() => setMostrarPago(false)} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>Donar {selectedCat ? selectedCat.name : ""}</Modal.Title>
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
                                    </>
                                ) : (
                                    <h6 className="text-center mt-3">
                                        <strong>Por favor inicia sesión o regístrate para donar.</strong>
                                    </h6>
                                )}
                            </Card>
                        ))}
                    />
                </div >
            </div >
        </div>
    );
};