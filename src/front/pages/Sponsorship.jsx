import Carousel from "../components/Carousel.jsx"
import { Card } from "../components/Card.jsx";
import { useEffect, useState } from "react";
import fotobackground from '../assets/img/fotobackground.jpeg';

export const Sponsorship = () => {
    const [cat, setCat] = useState([]);


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
    return (
        <div className="p-4" style={{ backgroundImage: `url(${fotobackground})`, backgroundSize: "cover", backgroundPosition: "center", minHeight: "680px" }}>

            <div className="content ">
                <h1 className="text-center p-2">Quieres apadrinar?</h1>
                <div className="text-center p-2" >
                    <div className="card border-info mb-3 mx-auto w-100" style={{ maxWidthidth: 800 }}>
                        <div className="card-body">
                            <h5 className="card-title">Apadrinar un gato es una forma hermosa y comprometida de ayudar sin necesidad de adoptar directamente. Cuando apadrinas, estás brindando un apoyo vital que permite cubrir sus necesidades básicas como alimentación, atención veterinaria, vacunas y un refugio seguro.  </h5>
                            <h5 className="card-title">Gracias a tu donación, los gatitos rescatados reciben cuidados constantes que mejoran su calidad de vida y les dan la oportunidad de crecer sanos y felices mientras esperan un hogar definitivo.

                            </h5>
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <Carousel cards={cat.map((cat) => (
                        <Card cat={cat} key={cat.id} />
                    )
                    )}
                    />
                </div>
            </div>
        </div>
    )
}