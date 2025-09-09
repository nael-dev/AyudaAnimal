import { useState } from "react";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import fotobackground from '../assets/img/fondo-login.webp';
import '../index.css';


export const Acogida = () => {
    const [form, setForm] = useState({
        name: " ",
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
        why: ""

    })



    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)


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

return (
    <form onSubmit={handleSubmit} className="container-fluid">
        <div className="row justify-content-center w-100">
            <div className="col-12 col-sm-12 col-md-10 col-lg-8 col-xl-6">
                <div className="input-box m-2">
                    <h3>Sobre ti</h3>
                    <input className="my-2 "
                        name="name"
                        type="name"
                        placeholder="Nombre"
                        onChange={handleChange}
                        required
                    />
                    <input className="my-2"
                        name="age"
                        type="age"
                        placeholder="Edad"
                        onChange={handleChange}
                        required
                    />
                    <input className="my-2"
                        name="phone"
                        type="`phone"
                        placeholder="Teléfono"
                        onChange={handleChange}
                        required
                    />
                    <input className="my-2"
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
                        <option value="ca">Cádiz</option>
                        <option value="Je">Jerez</option>
                        <option value="sf">San Fernando</option>
                        <option value="ch">Chiclana</option>
                    </select>

                    <select className="my-2" name="dwelling" onChange={handleChange} required>
                        <option value="">-- Mi casa es.. --</option>
                        <option value="pi">Piso</option>
                        <option value="ccp">Casa con patio o terraza </option>
                        <option value="csp">Casa sin patio o terraza</option>
                        <option value="cc"> Casa de campo</option>
                    </select>
                    <select className="my-2" name="access" onChange={handleChange} required>
                        <option value="">--Acceso a la casa --</option>
                        <option value="all">Acceso a toda la casa</option>
                        <option value="part">Acceso a una parte de la casa o habitaciones solamente </option>
                        <option value="only">Estará en el patio o la terraza</option>
                    </select>
                    <select className="my-2" name="company" onChange={handleChange} required>
                        <option value="">--Habitantes de casa --</option>
                        <option value="all">Vivo con mi pareja o familia  </option>
                        <option value="part">Vivo con mi paraje o familia y mis hijos gatunos/perrunos </option>
                        <option value="only">Vivo solo</option>
                        <option value="owa">Vivo solo y mis gatos o perros</option>
                    </select>
                    <select className="my-2" name="child" onChange={handleChange} required>
                        <option value="">--Hijos --</option>
                        <option value="yes">Tengo hijos  </option>
                        <option value="no">No tengo hijos </option>
                    </select>
                    <select className="my-2" name="protection" onChange={handleChange} required>
                        <option value="">--¿Tienes protegidas las ventanas/puertas/salidas --</option>
                        <option value="yes">Sí, lo tengo todo protegido </option>
                        <option value="nby">No, pero puedo ponerlo</option>
                        <option value="no">No, y no quiero ponerlo</option>
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

                <button type="submit" className="btn-login mt-2">Enviar</button>
            </div>
        </div>

    </form >

)
}