import logo from "../assets/img/logo.jpeg";
import ImageUploader from "../components/ImageUploader";
import { Link } from "react-router-dom";


export const Card = ({ cat, children }) => {



    return (
        <div
            className="card shadow-sm rounded-4 border border-info-subtle overflow-hidden"
            style={{ width: "14rem", transition: "transform 0.3s ease" }}
        >
            <div className="image-zoom-container bg-light d-flex justify-content-center align-items-center p-3">
                <ImageUploader idImage={cat.image} size={160} />
            </div>
            <div className="card-body text-center d-flex flex-column">
                <h5 className="card-title fw-semibold text-primary-emphasis">{cat.name}</h5>
                <Link to={`/detail-cat-page/${cat.id}`} className="mt-auto">
                    <button className="btn btn-primary-custom mt-3 w-100">Quiero saber más</button>
                </Link>
                {children}
            </div>
        </div>

    )
}
