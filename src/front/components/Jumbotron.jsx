import logo from "../assets/img/logo.jpeg";

export const Jumbotron = () => {
  return (
    <div
      className="jumbotron jumbotron-fluid d-flex flex-column flex-md-row align-items-center justify-content-center p-4"
      style={{
        background: "transparent",
        color: "#222",
        gap: "2rem",
      }}
    >
      <img
        src={logo}
        alt="Logo asociación"
        className="rounded-circle"
        style={{
          width: "160px",
          height: "160px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />

      <div
        style={{
          maxWidth: "700px",
          textAlign: "center",
          fontSize: "1.2rem", 
        }}
        className="px-2"
      >
        <h1 className="fw-semibold mb-3" style={{ fontSize: "3rem" }}>
          Asociación Ayuda Animal Jerez
        </h1>
        <p className="lead fw-bold mb-3" style={{ fontSize: "1.9rem" }}>
          ¡Bienvenid@ a Ayuda Animal Jerez!
        </p>
        <p style={{ lineHeight: "1.6rem", fontSize: "1.5rem" }}>
          ¿Sueñas con marcar la diferencia en la vida de un gatito? En nuestra asociación rescatamos, cuidamos y buscamos hogares llenos de amor para cientos de felinos vulnerables.
          <br />
          Apadrinar significa brindarles cuidados vitales sin asumir una adopción física, mientras que adoptar es regalarles un futuro seguro.
          <br />
          Cada ronroneo, cada juego y cada mirada agradecida son posibles gracias a ti.
          <br />
          <strong>¡Únete a esta cadena de esperanza! Juntos podemos transformar destinos.</strong>
        </p>
      </div>

      <img
        src={logo}
        alt="Logo asociación"
        className="rounded-circle d-none d-md-block"
        style={{
          width: "160px",
          height: "160px",
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    </div>
  );
};

export default Jumbotron;
