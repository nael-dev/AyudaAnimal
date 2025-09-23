import { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const EditUserForm = () => {
  const { store, dispatch } = useGlobalReducer();
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    birthdate: "",
  });
  const [message, setMessage] = useState(null);

  // Inicializa el formulario con los datos del store
  useEffect(() => {
    if (store.user) {
      setForm({
        name: store.user.name || "",
        lastname: store.user.lastname || "",
        birthdate: store.user.birthdate
          ? store.user.birthdate.split("T")[0]
          : "",
      });
    }
  }, [store.user]);

  // Maneja cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Valida el formulario antes de enviar
  const validateForm = () => {
    if (!form.name.trim() || !form.lastname.trim()) {
      setMessage("❌ Nombre y apellido no pueden estar vacíos");
      return false;
    }
    if (form.birthdate && isNaN(new Date(form.birthdate).getTime())) {
      setMessage("❌ Fecha de nacimiento inválida");
      return false;
    }
    return true;
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      console.log("Datos enviados:", form);

      const response = await fetch(`${backendUrl}/api/editUser`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${store.token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage("✅ Datos actualizados correctamente");
        dispatch({
          type: "set_user",
          payload: { user: data.user, token: store.token },
        });
      } else {
        setMessage("❌ Error: " + (data.error || "No se pudo actualizar"));
      }
    } catch (err) {
      setMessage("⚠️ Error de red: " + err.message);
    }
  };

  if (!store.user) return <p>Cargando datos del usuario...</p>;

  return (
    <div className="container p-4">
      <h2>Editar perfil</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Apellido</label>
          <input
            type="text"
            name="lastname"
            className="form-control"
            value={form.lastname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Fecha de nacimiento</label>
          <input
            type="date"
            name="birthdate"
            className="form-control"
            value={form.birthdate}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
