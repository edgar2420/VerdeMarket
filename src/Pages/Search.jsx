import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ApiService } from "../service/ApiService";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTerm = searchParams.get("nombre") || "";

  useEffect(() => {
    if (searchTerm) {
      const fetchSearchResults = async () => {
        setLoading(true);
        try {
          const results = await ApiService.searchProductos(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Error al realizar la búsqueda:", error);
          setSearchResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [searchTerm]);

  

  return (
    <div className="container mt-4">
      <h3>Resultados de búsqueda para: "{searchTerm}"</h3>
      {loading ? (
        <p>Cargando resultados...</p>
      ) : searchResults.length > 0 ? (
        <div className="row">
          {searchResults.map((result) => (
            <div key={result.id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={result.imagen || "/placeholder.jpg"}
                  className="card-img-top"
                  alt={result.nombre}
                />
                <div className="card-body">
                  <h5 className="card-title">{result.nombre}</h5>
                  <p className="card-text">{result.descripcion}</p>
                  <p className="text-muted">Precio: ${result.precio}</p>
                  <a href={`/productos/${result.id}`} className="btn btn-primary">
                    Ver más
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron resultados.</p>
      )}
    </div>
  );
}
