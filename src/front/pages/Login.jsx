import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import fotobackground from '../assets/img/fondo-login.webp';
import '../index.css';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { dispatch } = useGlobalReducer();

  const logoRef = useRef(null);
  const angleRef = useRef(0);

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

  const handleLogin = async (email, password) => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined");

      const response = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!data.token) return undefined;

      localStorage.setItem('token', data.token);
      localStorage.setItem('is_admin', JSON.stringify(data.is_admin));
      dispatch({ type: "set_token", payload: data.token });
      dispatch({ type: "admin", payload: { is_admin: data.is_admin } });
      return data;
    } catch (err) {
      setError("Error en login");
      return;
    }
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const response = await handleLogin(email, password);
    if (!response) {
      setError('Usuario o contraseña incorrecta');
      return;
    }
    if (response.is_admin) {
      navigate('/');
    } else {
      navigate('/user-data');
    }
  };


  return (
    <div
      className="login-page"
      style={{ backgroundImage: `url(${fotobackground})` }}
    >
      <div className="login-container">
        <div className="login-header">
          <h2>Login</h2>
          <i ref={logoRef} className="fa-solid fa-paw fa-2x"></i>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleOnSubmit}>
          <div className="input-box">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <i className="fa-solid fa-user"></i>
          </div>

          <div className="input-box">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <i className="fa-solid fa-lock"></i>
          </div>

          <div className="remember-forgot">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit" className="btn-login">Login</button>

          <div className="register-link">
            <p>No tienes cuenta? <Link to="/form">Regístrate</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};
