import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaInstagram, FaWhatsapp, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import fotobackground from '../assets/img/fondo-login.webp';
import '../index.css';

export const Form = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const logoRef = useRef(null);
  const angleRef = useRef(0);
  const navigate = useNavigate();

  // Animación logo
  useEffect(() => {
    let animationFrameId;
    const rotateLogo = () => {
      angleRef.current = (angleRef.current + 2) % 360;
      if (logoRef.current) logoRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      animationFrameId = requestAnimationFrame(rotateLogo);
    };
    rotateLogo();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Validaciones
  const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validatePassword(password)) {
      setPasswordError("Mínimo 8 caracteres, mayúscula, minúscula y número");
      valid = false;
    } else setPasswordError("");

    if (password !== confirmPassword) {
      setConfirmError("Las contraseñas no coinciden");
      valid = false;
    } else setConfirmError("");

    if (!valid) return;

    try {
      // Crear usuario y enviar correo directamente desde backend
      const signupRes = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const signupData = await signupRes.json();

      if (signupRes.ok && signupData.Ok) {
        // Backend envía el correo automáticamente
        navigate("/login");
      } else {
        setErrorMsg(signupData.error || "Error al crear usuario");
      }
    } catch (error) {
      setErrorMsg("Error al enviar: " + error.message);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${fotobackground})` }}>
      <form onSubmit={handleSubmit} className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="login-container p-4">
              <div className="login-header">
                <h2>Crear Nuevo Usuario</h2>
                <i ref={logoRef} className="fa-solid fa-paw fa-2x"></i>
              </div>

              {errorMsg && <div className="login-error">{errorMsg}</div>}

              {/* Email */}
              <div className="input-box">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Ej. mizifu22@gmail.com"
                  required
                />
                <i className="fa-solid fa-envelope"></i>
              </div>

              {/* Contraseña */}
              <div className="input-box position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <i className="fa-solid fa-lock"></i>
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {passwordError && <div className="input-error">{passwordError}</div>}

              {/* Confirmar contraseña */}
              <div className="input-box position-relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu contraseña"
                  required
                />
                <i className="fa-solid fa-lock"></i>
                <span
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {confirmError && <div className="input-error">{confirmError}</div>}

              <button type="submit" className="btn-login mt-2">Crear Usuario</button>

              <div className="register-link">
                <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link></p>
              </div>

              <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" style={{ color: "#25D366", margin: "0 8px" }}><FaWhatsapp size={28} /></a>
                <a href="https://instagram.com/tu_usuario" target="_blank" rel="noopener noreferrer" style={{ color: "#833AB4", margin: "0 8px" }}><FaInstagram size={28} /></a>
                <a href="https://facebook.com/tu_usuario" target="_blank" rel="noopener noreferrer" style={{ color: "#1877F2", margin: "0 8px" }}><FaFacebook size={28} /></a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
