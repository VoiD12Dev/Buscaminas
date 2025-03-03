function Tarjeta({ texto, imagen, alternativo }) {
  return (
    <div className="card mb-3 tarjeta1" style={{ maxWidth: "700px" }}>
      <div className="row g-0">
        <div
          className="col-md-4 d-flex align-items-center justify-content-center contornoImagen"
          style={{ height: "200px" }}
        >
          <img
            src={imagen}
            className="img-fluid rounded-start imagenExplicativa"
            alt={alternativo}
          />
        </div>
        <div className="col-md-8 d-flex align-items-center">
          <div className="card-body">
            <p className="card-text text-center">{texto}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tarjeta;
