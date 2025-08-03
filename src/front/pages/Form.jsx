import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import fotobackground from '../assets/img/fotobackground.jpeg';

export const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMsg("Por favor ingresa email y contraseña.");
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("Backend error");
      const response = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.Ok) {
        navigate("/login");
      } else {
        setErrorMsg(result.error || "Error al crear usuario");
      }
    } catch (error) {
      setErrorMsg("Error al enviar: " + error.message);
    }
  };

  return (
    <div
      className="p-5"
      style={{
        backgroundImage: `url(${fotobackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="container" style={{ maxWidth: "500px" }}>
          <div
            className="p-4 border rounded-4 shadow-sm bg-white transition-hover"
            style={{
              borderColor: "#dee2e6",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0.5rem 1rem rgb(0, 0, 0)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 .125rem .25rem rgb(0, 0, 0)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <h2 className="mb-4 text-center">Crear Nuevo Usuario</h2>

            <div className="mb-3">
              <label htmlFor="gmail" className="form-label fw-semibold">
                Correo Gmail
              </label>
              <input
                type="email"
                className="form-control"
                id="gmail"
                placeholder="Ej. Mizifú22@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid text-center">
              <button type="submit" className="btn btn-primary-custom mt-auto w-100">
                Crear Usuario
              </button>
              <span className="mt-2 d-block">
                Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
              </span>
            </div>
            {errorMsg && (
              <p
                className="mt-3 text-center text-danger fw-semibold"
                style={{ fontSize: "0.9rem" }}
              >
                {errorMsg}
              </p>
            )}

            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#25D366", margin: "0 8px" }}
              >
                <FaWhatsapp size={32} />
              </a>
              <a
                href="https://instagram.com/tu_usuario"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#833AB4", margin: "0 8px" }}
              >
                <FaInstagram size={32} />
              </a>
              <a
                href="https://facebook.com/tu_usuario"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#1877F2", margin: "0 8px" }}
              >
                <FaFacebook size={32} />
              </a>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
