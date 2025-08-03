import { useState, useEffect } from "react"
import Carousel from "./Carousel.jsx";
 const ListFoodCat = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        const ListProduct = async () => {
            try {
                const response = await fetch('./productos.json');
                const products = await response.json();
                setData(products);

            } catch (err) {
                console.error("Error fetching products:", err);
            }
        };

        ListProduct();
    }, []);

    const cards = data.map((item, index) => (
    <div
        className="card shadow-sm rounded-4 border-0 overflow-hidden m-3 h-100 d-flex flex-column justify-content-between"
        style={{ width: "16rem", minHeight: "460px", transition: "transform 0.3s ease" }}
        key={index}
    >
        <img
            src={item.imagen}
            className="card-img-top mt-3"
            alt={item.nombre}
            style={{ objectFit: "cover", height: "200px" }}
        />
        <div className="card-body d-flex flex-column">
            <h5 className="card-title fw-semibold">{item.nombre}</h5>
            <p className="card-text text-muted mb-2">{item.precio}</p>
            <a
                href={item.url}
                className="btn btn-primary-custom mt-auto w-100"
                target="_blank"
                rel="noopener noreferrer"
            >
                Comprar
            </a>
        </div>
    </div>
));
    return (
        <div>
             <h1 className="fw-bold display-5" style={{ color: "black" }}>
                    🐾 Piensos para tu gato
                </h1>
            <Carousel cards={cards} />
        </div>
    );
};

export default ListFoodCat;
