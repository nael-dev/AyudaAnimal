import React, { useEffect, useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Card } from "../components/Card.jsx";
import Carousel from "../components/Carousel.jsx";
import Jumbotron from "../components/Jumbotron.jsx";
import { GiPawHeart } from "react-icons/gi";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import ListFoodCat from "../components/ListFoodCat.jsx";
import ImageUploader from "../components/ImageUploader.jsx";
import { Link } from "react-router-dom";
import fotobackground from "../assets/img/fotobackground.jpeg";
import { loadStripe } from "@stripe/stripe-js";
import { Modal } from "react-bootstrap";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../components/CheckoutForm.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const Home = () => {
  const [cats, setCats] = useState([]);
  const { store, dispatch } = useGlobalReducer();
  const [mostrarPago, setMostrarPago] = useState(false);
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("EUR");
  const [selectedCat, setSelectedCat] = useState(null);


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
    if (selectedCat) handlePostSponsor(selectedCat.id);
    setMostrarPago(false);
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || store.user) return;

    const fetchUser = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`/api/user/user-data`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo recuperar el usuario");

        const data = await res.json();
        dispatch({ type: "set_user", payload: { user: data.user, token } });
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (err) {
        console.error("Error al recuperar el usuario:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleGetCat = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) throw new Error("Backend error");
        const response = await fetch(`/api/cat`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error(`Error`);
        const data = await response.json();
        setCats(data.cats);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    handleGetCat();
  }, []);

  const LoggedIn = !!localStorage.getItem("token");

  const tips = [
    {
      title: "La alimentación",
      content:
        "Darle una alimentación variada, equilibrada y de buena calidad, y proporcionarle agua fresca todos los días.",
    },
    {
      title: "La cama",
      content:
        "Ponerle una camita cómoda, suave y amplia, y dos cuencos o platos hondos para la comida y el agua.",
    },
    {
      title: "El arenero",
      content:
        "Mantener el arenero limpio y en un lugar tranquilo, ya que los gatos son muy higiénicos y exigentes.",
    },
    {
      title: "La malta",
      content: "Ofrecerle malta de vez en cuando para evitar las bolas de pelo en el estómago.",
    },
    {
      title: "Entretenimiento",
      content:
        "Jugar con él y estimular su curiosidad con juguetes, rascadores y enriquecimiento ambiental.",
    },
    {
      title: "El agua",
      content:
        "Los gatos no son grandes bebedores. Debemos fomentar su ingesta de agua. Podemos conseguirlo colocando fuentes de agua para captar su atención.",
    },
    {
      title: "La curiosidad",
      content:
        "Los gatos indoor se aburren en el sofá y les llama la atención lo que ocurre en el exterior. Por ello muchos deciden asomarse y saltar al vacío. Ten cuidado.",
    },
    {
      title: "Ambientación",
      content:
        "Facilitarle juguetes que estimulen su inteligencia. Puedes proporcionarle estanterías a diversas alturas y esconder algunos premios antes de irte de casa.",
    },
    {
      title: "El rascador",
      content:
        "No te enfades si ves que tu gato se afila las uñas en el sofá. Piensa que ellos en libertad lo harían en un tronco de árbol, sólido y fuerte. Consigue uno estable.",
    },
  ];

  return (
    <div
      className="text-center p-5"
      style={{
        backgroundImage: `url(${fotobackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Jumbotron />
      <hr className="my-4 border-3 border-dark opacity-50" />
      <h1 className="fw-bold display-5" style={{ color: "black" }}>
        Conoce nuestros gatitos! <GiPawHeart />
      </h1>
      <Carousel
        cards={cats.map((catItem) => (
          <Card cat={catItem} key={catItem.id}>
            {LoggedIn ? (
              <>
                <button
                  className="btn btn-primary-custom mt-3 w-100"
                  onClick={() => { setSelectedCat(catItem); setMostrarPago(true); }}
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
      <hr className="my-4 border-3 border-dark opacity-50" />
      <h1 className="fw-bold display-5" style={{ color: "black" }}>
        Tips para cuidar de tu minino <MdOutlineTipsAndUpdates />
      </h1>
      <Carousel
        cards={tips.map((tip) => (
          <div
            key={tip.title}
            className="card shadow-sm rounded-4 border border-info-subtle overflow-hidden m-3"
            style={{
              width: "14rem",
              transition: "transform 0.3s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              className="bg-light p-3 d-flex justify-content-center align-items-center"
              style={{ height: 120 }}
            >
              <MdOutlineTipsAndUpdates size={48} className="text-info" />
            </div>
            <div className="card-body text-center d-flex flex-column">
              <h5 className="card-title fw-semibold text-primary-emphasis">
                {tip.title}
              </h5>
              <p className="card-text text-secondary mt-auto">{tip.content}</p>
            </div>
          </div>
        ))}
      />
      <hr className="my-4 border-3 border-dark opacity-50" />
      <ListFoodCat />
    </div>
  );
};
