import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { ApiService } from "../../service/ApiService";
import { useUser } from "../../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faStar, faCheck } from "@fortawesome/free-solid-svg-icons";

export default function DetallesDelProducto() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, addToCart } = useUser();
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await ApiService.getProductoById(id);

        
        if (response.imagenUrl) {
          try {
            const parsedImages = JSON.parse(response.imagenUrl);
            setImagenes(parsedImages);
          } catch {
            setImagenes([response.imagenUrl]);
          }
        }

        setProducto(response);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!producto) {
    return <div>Producto no encontrado.</div>;
  }


  const handleAddToCart = () => {
    if (user) {
      addToCart(producto);
      navigate("/cart");
    } else {
      alert("Debes iniciar sesión para añadir productos al carrito.");
    }
  };

  return (
    <section className="padding-y bg-white shadow-sm">
      <div className="container">
        <div className="row">
          {/* Galería de imágenes */}
          <aside className="col-lg-5">
            <article className="gallery-wrap">
              {/* Imagen principal con zoom */}
              <div className="img-big-wrap mb-3">
                {imagenes.length > 0 ? (
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: producto.nombre,
                        isFluidWidth: true,
                        src: `https://backendecommerce-dy3z.onrender.com${imagenes[0]}`,
                      },
                      largeImage: {
                        src: `https://backendecommerce-dy3z.onrender.com${imagenes[0]}`,
                        width: 1200,
                        height: 1200,
                      },
                      enlargedImageContainerStyle: { zIndex: 9 },
                    }}
                  />
                ) : (
                  <img
                    src="/images/product.jpg"
                    className="rounded img-fluid"
                    alt="Producto sin imagen"
                  />
                )}
              </div>

              {/* Miniaturas de imágenes adicionales */}
              {imagenes.length > 1 && (
                <div className="thumbs-wrap d-flex">
                  {imagenes.map((imagen, index) => (
                    <img
                      key={index}
                      src={`https://backendecommerce-dy3z.onrender.com${imagen}`}
                      className="me-2 rounded"
                      alt={`Imagen ${index + 1}`}
                      style={{ width: "60px", height: "60px", cursor: "pointer" }}
                      onClick={() => {
                      
                        const temp = [...imagenes];
                        const [clickedImage] = temp.splice(index, 1);
                        setImagenes([clickedImage, ...temp]);
                      }}
                    />
                  ))}
                </div>
              )}
            </article>
          </aside>

          {/* Detalles del producto */}
          <div className="col-lg-4">
            <article>
              <p className="title h4 mb-1">{producto.nombre}</p>
              <p className="text-success">
                <FontAwesomeIcon icon={faCheck} />{" "}
                {producto.stock > 0 ? "En stock" : "Agotado"}
              </p>
              <hr />
              <p>Descripción: {producto.descripcion}</p>
              <p>Precio: {producto.precio} Bs</p>
            </article>
          </div>

          {/* Acciones del producto */}
          <aside className="col-lg-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="mb-4">
                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleAddToCart}
                  >
                    Añadir al carrito
                  </button>
                </div>
                <ul className="list-icon">
                  <li>
                    <FontAwesomeIcon icon={faLock} /> Pago seguro
                  </li>
                  <li>
                    <FontAwesomeIcon icon={faStar} /> 2 años de garantía total
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
