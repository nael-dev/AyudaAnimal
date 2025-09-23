import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/img/logo.jpeg";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { LuPawPrint, LuLogOut, LuUser, LuUserPlus, LuMoon, LuSun } from "react-icons/lu";
import { useState } from "react";

export const Navbar = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("is_admin");
    dispatch({ type: "Logout" });
    navigate("/");
  };

  const isLoggedIn = !!store.user || store.is_admin;

  let userDisplayName = "Invitado";
  if (store.is_admin) {
    userDisplayName = "Admin";
  } else if (store.user) {
    userDisplayName = "Área Personal";
  }

  return (
    <nav className={`navbar navbar-expand-lg navbar-custom sticky-top ${darkMode ? "dark-mode" : ""}`}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" className="logo spin-icon" />
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 gap-lg-4 mx-auto">
            <li className="nav-item">
              <Link className="nav-link nav-link-custom" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/adoption">
                Quiero adoptar <LuPawPrint />
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/sponsorship">
                Quiero apadrinar <LuPawPrint />
              </Link>
            </li>
             <li className="nav-item">
              <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/acogida">
                Quiero ser casa de acogida <LuPawPrint />
              </Link>
            </li>

            {store.is_admin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/Admin">
                    Gestionar Gatos <LuPawPrint />
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link nav-link-custom d-flex align-items-center gap-1" to="/admin-list-sponsor">
                    Listado Sponsors <LuPawPrint />
                  </Link>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="btn btn-toggle-mode"
              aria-label="Toggle dark mode"
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <LuSun size={20} /> : <LuMoon size={20} />}
            </button>

            <div className="dropdown">
              <button
                className="btn btn-user dropdown-toggle d-flex align-items-center gap-2"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {isLoggedIn ? <LuUser size={20} /> : <LuUserPlus size={20} />}
                <span className="user-email">{userDisplayName}</span>
              </button>
              <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-custom`}>
                {isLoggedIn ? (
                  <>
                   <li>
                       <Link className="dropdown-item" to="/edit-user">Perfil de usuario</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <Link className="dropdown-item" to="/user-data">Mis Donaciones</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button
                        className="dropdown-item text-danger d-flex align-items-center gap-2"
                        onClick={handleLogout}
                      >
                        <LuLogOut size={18} /> Cerrar sesión
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link className="dropdown-item" to="/login">Iniciar sesión</Link></li>
                    <li><Link className="dropdown-item" to="/form">Registrarme</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
