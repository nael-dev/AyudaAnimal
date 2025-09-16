import Carousel from "../components/Carousel.jsx"
import { Card } from "../components/Card.jsx";
import { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import fotobackground from '../assets/img/fotobackground.jpeg';


export const Adoption = () => {
    const [cat, setCat] = useState([]);

    const { store, dispatch } = useGlobalReducer()

    useEffect(() => {

        const handleGetCat = async () => {

            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL
                if (!backendUrl) throw new Error('Backend error')
                const response = await fetch(`${backendUrl}/api/cat`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Error`);
                }
                const data = await response.json();

                setCat(data.cats);
            } catch (err) {
                setError('Error cargando el gato: ' + err.message);
                console.error('Error:', err);
            }
        };

        handleGetCat();
    }, [])

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
        <div className="p-4 " style={{ backgroundImage: `url(${fotobackground})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "800px" }}>

            <div className="content">
                <h1 className="text-center p-2">Quieres adoptar?</h1>
                <div class="container my-5">
                    <div class="card shadow-lg border-0 rounded-4">
                        <div class=" text-center p-4">
                            <h3 class="mb-3">🐾 ¡Hazte casa de acogida y salva vidas! 🐾</h3>
                            <p class="fs-5">
                                En nuestra protectora recibimos muchos gatos que necesitan un lugar seguro donde recuperarse, socializar y esperar a su familia definitiva.
                            </p>
                            <p>
                                Las casas de acogida son un <strong>pilar fundamental</strong> para nosotros: gracias a ellas, los gatos pueden salir del refugio o de la calle y vivir temporalmente en un hogar lleno de cuidados y cariño.
                            </p>

                            <h5 class="mt-4">👉 ¿Qué significa ser casa de acogida?</h5>
                            <ul class="list-unstyled mt-3">
                                <li>🏡 Ofrecer un espacio seguro y tranquilo a un gato de manera temporal.</li>
                                <li>🍽️ Brindarle alimentación, agua, cariño y la atención diaria que necesita.</li>
                                <li>🩺 Llevarlo al veterinario en caso de necesidad (nosotros asumimos los gastos).</li>
                                <li>💞 Ayudarlo en su proceso de socialización para que esté listo para la adopción.</li>
                            </ul>

                            <p class="mt-4">
                                💜 Lo único que pedimos es <strong>compromiso y responsabilidad</strong>.
                                Nosotros nos encargamos de los gastos veterinarios y ofrecemos asesoramiento y apoyo en todo momento.
                            </p>
                            <p>
                                Ser casa de acogida no solo salva vidas, también te da la oportunidad de vivir una experiencia única: acompañar a un gato en su camino hacia su hogar definitivo.
                            </p>
                            <p>Rellena este formulario y nos pondremos en contacto con vosotros.</p>


                        </div>
                    </div>
                </div>
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
                                    <option value="Cadiz">Cádiz</option>
                                    <option value="Jerez">Jerez</option>
                                    <option value="San Fernando">San Fernando</option>
                                    <option value="Chiclana">Chiclana</option>
                                    <option value="El puerto">El puerto </option>
                                </select>

                                <select className="my-2" name="dwelling" onChange={handleChange} required>
                                    <option value="">-- Mi casa es.. --</option>
                                    <option value="Piso">Piso</option>
                                    <option value="casa con patio o terraza">Casa con patio o terraza </option>
                                    <option value="casa sin patio o terraza">Casa sin patio o terraza</option>
                                    <option value="casa de campo"> Casa de campo</option>
                                </select>
                                <select className="my-2" name="access" onChange={handleChange} required>
                                    <option value="">--Acceso a la casa --</option>
                                    <option value="Acceso a toda la casa">Acceso a toda la casa</option>
                                    <option value="Acceso a una parte de la casa o habitaciones solamente">Acceso a una parte de la casa o habitaciones solamente </option>
                                    <option value="Estará en el patio o la terraza">Estará en el patio o la terraza</option>
                                </select>
                                <select className="my-2" name="company" onChange={handleChange} required>
                                    <option value="">--Habitantes de casa --</option>
                                    <option value="Vivo con mi pareja o familia">Vivo con mi pareja o familia  </option>
                                    <option value="Vivo con mi paraje o familia y mis hijos gatunos/perrunos ">Vivo con mi paraje o familia y mis hijos gatunos/perrunos </option>
                                    <option value="Vivo solo">Vivo solo</option>
                                    <option value="Vivo solo y mis gatos o perros">Vivo solo y mis gatos o perros</option>
                                </select>
                                <select className="my-2" name="child" onChange={handleChange} required>
                                    <option value="">--Hijos --</option>
                                    <option value="si">Tengo hijos  </option>
                                    <option value="no">No tengo hijos </option>
                                </select>
                                <select className="my-2" name="protection" onChange={handleChange} required>
                                    <option value="">--¿Tienes protegidas las ventanas/puertas/salidas --</option>
                                    <option value="SI">Sí, lo tengo todo protegido </option>
                                    <option value="No, pero puedo ponerlas">No, pero puedo ponerlo</option>
                                    <option value="No">No, y no quiero ponerlo</option>
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
            </div >
            <div className="p-5">
                <Carousel cards={cat.map((cat) => (
                    <Card cat={cat} key={cat.id} />
                )
                )}
                />
            </div>
        </div>
    
    )
}