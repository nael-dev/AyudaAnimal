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

export const Adoption = () => {
    const [cats, setCats] = useState([]);
    const [mostrarPago, setMostrarPago] = useState(false);
    const [selectedCat, setSelectedCat] = useState(null);
    const [amount, setAmount] = useState(0);
    const [currency, setCurrency] = useState("EUR");
    const { store, dispatch } = useGlobalReducer();

    const [form, setForm] = useState({
        formType: "adoption",
        name: "",
        age: "",
        phone: "",
        email: "",
        city: "",
        dwelling: "",
        access: "",
        company: "",
        child: "",
        protection: "",
        otherAnimals: "",
        aloneInHome: "",
        why: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/send-email",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );
            const data = await resp.json();
            if (data.success) {
                alert("✅ Formulario enviado correctamente, revisa tu correo");
            } else {
                alert("❌ Error al enviar: " + data.error);
            }
        } catch (error) {
            alert("⚠️ Error de red: " + error.message);
        }
    };

    const handleGetCats = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            if (!backendUrl) throw new Error("Backend error");
            const response = await fetch(`${backendUrl}/api/cat`);
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
            await fetch(`${backendUrl}/api/payment-registration`, {
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
        <div
            className="p-4"
            style={{
                backgroundImage: `url(${fotobackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "800px",
            }}
        >
            {/* Formulario */}
            <div className="content">
                <h1 className="text-center p-2">¿Quieres adoptar?</h1>
                <div className="container my-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="text-center p-4">
                            <h3 className="mb-3">🐾 Rellena el formulario para que sepamos más de ti 🐾</h3>
                            <p>Rellena este formulario y nos pondremos en contacto contigo.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="container-fluid">
                    <div className="row justify-content-center w-100">
                        <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6">
                            <div className="input-box m-2">
                                <h3>Sobre ti</h3>
                                <input
                                    className="my-2"
                                    name="name"
                                    type="text"
                                    placeholder="Nombre"
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    className="my-2"
                                    name="age"
                                    type="number"
                                    placeholder="Edad"
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    className="my-2"
                                    name="phone"
                                    type="tel"
                                    placeholder="Teléfono"
                                    onChange={handleChange}
                                    required
                                />
                                <input
                                    className="my-2"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-box m-2">
                                <h3>Sobre el gatito</h3>
                                <select className="my-2" name="city" onChange={handleChange} required>
                                    <option value="">-- Vivo en.. --</option>
                                    <option value="Cadiz">Cádiz</option>
                                    <option value="Jerez">Jerez</option>
                                    <option value="San Fernando">San Fernando</option>
                                    <option value="Chiclana">Chiclana</option>
                                    <option value="El puerto">El puerto </option>
                                </select>

                                <select className="my-2" name="dwelling" onChange={handleChange} required>
                                    <option value="">-- Mi casa es.. --</option>
                                    <option value="Piso">Piso</option>
                                    <option value="casa con patio o terraza">Casa con patio o terraza </option>
                                    <option value="casa sin patio o terraza">Casa sin patio o terraza</option>
                                    <option value="casa de campo"> Casa de campo</option>
                                </select>
                                <select className="my-2" name="access" onChange={handleChange} required>
                                    <option value="">--Acceso a la casa --</option>
                                    <option value="Acceso a toda la casa">Acceso a toda la casa</option>
                                    <option value="Acceso a una parte de la casa o habitaciones solamente">Acceso a una parte de la casa o habitaciones solamente </option>
                                    <option value="Estará en el patio o la terraza">Estará en el patio o la terraza</option>
                                </select>
                                <select className="my-2" name="company" onChange={handleChange} required>
                                    <option value="">--Habitantes de casa --</option>
                                    <option value="Vivo con mi pareja o familia">Vivo con mi pareja o familia  </option>
                                    <option value="Vivo con mi paraje o familia y mis hijos gatunos/perrunos ">Vivo con mi paraje o familia y mis hijos gatunos/perrunos </option>
                                    <option value="Vivo solo">Vivo solo</option>
                                    <option value="Vivo solo y mis gatos o perros">Vivo solo y mis gatos o perros</option>
                                </select>
                                <select className="my-2" name="child" onChange={handleChange} required>
                                    <option value="">--Hijos --</option>
                                    <option value="si">Tengo hijos  </option>
                                    <option value="no">No tengo hijos </option>
                                </select>
                                <select className="my-2" name="protection" onChange={handleChange} required>
                                    <option value="">--¿Tienes protegidas las ventanas/puertas/salidas --</option>
                                    <option value="SI">Sí, lo tengo todo protegido </option>
                                    <option value="No, pero puedo ponerlas">No, pero puedo ponerlo</option>
                                    <option value="No">No, y no quiero ponerlo</option>
                                </select>
                                <textarea
                                    name="otherAnimals"
                                    placeholder="¿Hay otros animales en casa?
                                    ¿Que tipo de animales son?
                                    ¿Están vacunados, chipados y desparasitados?
                                        "
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    name="aloneInHome"
                                    placeholder="¿Cuánto tiempo puedes dedicarle al gatito?,
                                    ¿ Cuánto tiempo estaría solo en casa?
                                        "
                                    onChange={handleChange}
                                    required
                                />
                                <textarea
                                    name="why"
                                    placeholder="¿Por qué quieres ser casa de acogida?
                                        "
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <button type="submit" className="btn btn-primary-custom mt-3 w-100">
                                Enviar
                            </button>
                        </div>
                    </div>
                </form>
            </div >

            {/* Carrusel */}
            < div className="p-5" >
                <Carousel
                    cards={cats.map((catItem) => (
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
    );
};
