import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import fotobackground from '../assets/img/fotobackground.jpeg';


export const AdminListSponsor = () => {
    const [sponsor, setSponsor] = useState([]);
    const { store } = useGlobalReducer();


    useEffect(() => {
        if (store.token) {
            handleListSponsor();
        }
    }, [store.token]);

    const handleListSponsor = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL
            if (!backendUrl) throw new Error('Backend error')

            const response = await fetch(`${backendUrl}/api/payment-registration-admin`,

                {
                    headers: {
                        'Authorization': `Bearer ${store.token}`
                    }
                }
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSponsor(data.payments);
        } catch (error) {
            console.error("Error fetching sponsors:", error);
        }
    };
    if (!store.token) {
        return <p>Cargando token, por favor espera...</p>;
    }
    console.log(store.currency)

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
                            Lista de Patrocinadores
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mt-5 mb-5">
                <div
                    className="card shadow-sm bg-white bg-opacity-75 rounded-4"
                    style={{
                        height: "800px",
                        overflowY: "auto",
                        padding: "1rem",
                        border: "1px solid #0d6efd",
                    }}
                >
                    <div className="card-body">
                        {sponsor.length === 0 && (
                            <p className="text-center text-muted">No hay patrocinadores aún.</p>
                        )}

                        {sponsor.map((item, index) => (
                            <div
                                key={index}
                                className="mb-3 p-3 border rounded-3"
                                style={{ backgroundColor: "rgba(13, 110, 253, 0.1)" }}
                            >
                                <h5 className="card-title text-primary fw-semibold">
                                    Nombre del gato: <strong>{item.sponsor.cat_name}</strong>
                                </h5>
                                <p className="card-text fw-semibold">
                                    Email de usuario:{" "}
                                    <span className="text-dark">{item.sponsor.user_email}</span>
                                </p>
                                <p className="card-text fw-semibold">
                                    Cantidad:{" "}
                                    <span className="text-dark">
                                        {item.amount} {store.currency}
                                    </span>
                                </p>
                                <p className="card-text">
                                    <strong>Fecha de Registro:</strong>{" "}
                                    {new Date(
                                        new Date(item.date_payment).getTime() + 2 * 60 * 60 * 1000 // ⬅️ Ajuste de +2h
                                    ).toLocaleString("es-ES", {
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

}
