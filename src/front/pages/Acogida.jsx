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
        welcomeTime: "",
        babyAnimal: "",
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
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                    <input
                        name="Nombre"
                        type="name"
                        placeholder="name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Edad"
                        type="age"
                        placeholder="age"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="Teléfono"
                        type="`phone"
                        placeholder="phone"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <select name="city" onChange={handleChange} required>
                        <option value="">-- Selecciona una ciudad --</option>
                        <option value="ca">Cádiz</option>
                        <option value="Je">Jerez</option>
                        <option value="sf">San Fernando</option>
                        <option value="ch">Chiclana</option>
                    </select>
                    <h3>Sobre el gatito</h3>

                    <select name="dwelling" onChange={handleChange} required>
                        <option value="">-- Tipo de vivienda --</option>
                        <option value="pi">Piso</option>
                        <option value="ccp">Casa con patio o terraza </option>
                        <option value="csp">Casa sin patio o terraza</option>
                        <option value="cc"> Casa de campo</option>
                    </select>
                    <select name="access" onChange={handleChange} required>
                        <option value="">--Acceso a la casa --</option>
                        <option value="all">Acceso a toda la casa</option>
                        <option value="part">Acceso a una parte de la casa o habitaciones solamente </option>
                        <option value="only">Estará en el patio o la terraza</option>
                    </select>
                    <select name="company" onChange={handleChange} required>
                        <option value="">--Habitantes de casa --</option>
                        <option value="all">Vivo con mi pareja o familia  </option>
                        <option value="part">Vivo con mi paraje o familia y mis hijos gatunos/perrunos </option>
                        <option value="only">Vivo solo</option>
                        <option value="owa">Vivo solo y mis gatos o perros</option>
                    </select>
                    <select name="child" onChange={handleChange} required>
                        <option value="">--Hijos --</option>
                        <option value="yes">Tengo hijos  </option>
                        <option value="no">No tengo hijos </option>
                    </select>
                    <select name="protection" onChange={handleChange} required>
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
                        name="aloneInHome"
                        placeholder="¿Cuánto tiempo puedes dedicarle al gatito?,
                                    ¿ Cuánto tiempo estaría solo en casa?
                                        "
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">Enviar</button>
                </div>
            </div>
        </form>

    )
}