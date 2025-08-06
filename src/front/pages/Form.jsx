
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import fotobackground from '../assets/img/fondo-login.webp';
import '../index.css';

export const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const logoRef = useRef(null);
  const angleRef = useRef(0);

  const navigate = useNavigate();
  useEffect(() => {
    let animationFrameId;

    const rotateLogo = () => {
      angleRef.current = (angleRef.current + 2) % 360;
      if (logoRef.current) {
        logoRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      animationFrameId = requestAnimationFrame(rotateLogo);
    };

    rotateLogo();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

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
      className="login-page"
      style={{
        backgroundImage: `url(${fotobackground})`

      }}
    >
      <form onSubmit={handleSubmit} className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div
              className="login-container p-4"
              style={{
                transition: "box-shadow 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0.5rem 1rem rgba(0,0,0,0.2)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 .125rem .25rem rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="login-header">
                <h2>Crear Nuevo Usuario</h2>
                <i ref={logoRef} className="fa-solid fa-paw fa-2x"></i>
              </div>

              {errorMsg && (
                <div className="login-error">{errorMsg}</div>
              )}

              <div className="input-box">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej. Mizifú22@gmail.com"
                  required
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <i className="fa-solid fa-lock"></i>
              </div>

              <button type="submit" className="btn-login mt-2">
                Crear Usuario
              </button>

              <div className="register-link">
                <p>
                  ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
                </p>
              </div>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#25D366", margin: "0 8px" }}
                >
                  <FaWhatsapp size={28} />
                </a>
                <a
                  href="https://instagram.com/tu_usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#833AB4", margin: "0 8px" }}
                >
                  <FaInstagram size={28} />
                </a>
                <a
                  href="https://facebook.com/tu_usuario"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1877F2", margin: "0 8px" }}
                >
                  <FaFacebook size={28} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
