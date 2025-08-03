import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import fotobackground from '../assets/img/fotobackground.jpeg';

export const UserData = () => {
    const { store } = useGlobalReducer();
    const [payments, setPayments] = useState([]);



    const handleListSponsor = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error('Backend error')
            const response = await fetch(
                `${backendUrl}/api/payment-registration`, {
                headers: {
                    'Authorization': `Bearer ${store.token}`
                }
            }
            );
            const data = await response.json();


            setPayments(data.payments);
        } catch (error) {
            console.error("Error fetching payments:", error);
        }
    };
    useEffect(() => {
        if (store.user) {
            handleListSponsor();
        }
    }, [store.user]);

   return (
  <div
    className="p-5"
    style={{
      backgroundImage: `url(${fotobackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: 680,
    }}
  >
    <div className="container p-3">
      <div className="card shadow-sm bg-white bg-opacity-75 rounded-4">
        <div className="card-body">
          <h1 className="card-text text-center fw-bold text-primary">
            Listado de gatos a los que has donado.
          </h1>
        </div>
      </div>
    </div>

    <div className="container mt-5 mb-5">
      <div
        className="card shadow-sm bg-white bg-opacity-75 rounded-4"
        style={{
          maxHeight: "1500px",
          overflowY: "auto",
          padding: "1rem",
          border: "1px solid #0d6efd",
        }}
      >
        <div className="card-body">
          {payments.length === 0 && (
            <p className="text-center text-muted">No hay donaciones aún.</p>
          )}

          {payments.map((item, index) => (
            <div
              key={index}
              className="mb-3 p-3 border rounded-3"
              style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
            >
              <h5 className="card-title text-primary fw-semibold">
                Nombre del gato: {item.sponsor.cat_name}
              </h5>
              <p className="card-text fw-semibold">
                Cantidad: <span className="text-dark">{item.amount}</span>{" "}
                <span className="text-primary">{store.currency}</span>
              </p>
              <p className="card-text">
                <strong>Fecha de Registro:</strong>{" "}
                {new Date(item.date_payment).toLocaleString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

};

