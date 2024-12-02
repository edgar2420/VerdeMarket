import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { ApiService } from "../service/ApiService";

export default function Nav() {
  const { user, cart, logout } = useUser();
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/buscar?nombre=${searchTerm.trim()}`);
    }
  };

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await ApiService.getCategorias();
        setCategorias(response);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategorias();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="section-header">
      {/* Header principal */}
      <div className="header-main border-bottom">
        <div className="container">
          <div className="d-flex flex-nowrap align-items-center">
            {/* Logo */}
            <div className="col-lg-2 col-sm-3 col-3 unzoomMobile">
              <Link to="/" className="brand-wrap">
                <img className="logo" height="20" src="/logo192.png" alt="Logo" />
              </Link>
            </div>

            {/* Barra de búsqueda */}
            <div className="col-lg-6 col-sm-6 col-6 unzoomMobile">
              <form className="me-3" onSubmit={handleSearchSubmit}>
                <div className="input-group w-100">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar"
                    style={{ width: "55%" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="input-group-text btn btn-primary" type="submit">
                    <FontAwesomeIcon icon={faSearch} />
                  </button>
                </div>
              </form>
            </div>

            {/* Opciones de usuario y carrito */}
            <div className="col-lg-4 col-sm-3 col-3">
              <div className="float-md-end">
                {/* Mi Carrito */}
                <div className="widget-header">
                  <Link className="icontext" to="/cart">
                    <div className="icon">
                      <FontAwesomeIcon icon={faShoppingCart} />
                    </div>
                    <div className="text mobileinvisible">
                      <small className="text-muted">Mi carrito</small> <br />
                      <span className="text-dark">
                        {cart.length} Productos
                      </span>
                    </div>
                  </Link>
                </div>

                {/* Usuario / Mi Cuenta */}
                <div className="widget-header dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle ms-3 icontext"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="icon">
                      <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div className="text d-none d-lg-block">
                      {user ? (
                        <>
                          <small className="text-muted">Bienvenido</small> <br />
                          <span className="text-dark">{user.nombre}</span>
                        </>
                      ) : (
                        <>
                          <small className="text-muted">Iniciar sesión</small> <br />
                          <span className="text-dark">Mi cuenta</span>
                        </>
                      )}
                    </div>
                  </a>
                  {!user ? (
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/signin">
                          Inicia sesión
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/signup">
                          Regístrate
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <ul className="dropdown-menu dropdown-menu-end">
                      {/* Mi perfil siempre visible */}
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Mi perfil
                        </Link>
                      </li>

                      {/* Mis productos visible solo para vendedor o ambos */}
                      {(user.tipoUsuario === "vendedor" || user.tipoUsuario === "ambos") && (
                        <li>
                          <Link className="dropdown-item" to="/mis-productos">
                            Mis productos
                          </Link>
                        </li>
                      )}

                      {/* Mis pedidos visible solo para comprador o ambos */}
                      {(user.tipoUsuario === "comprador" || user.tipoUsuario === "ambos") && (
                        <li>
                          <Link className="dropdown-item" to="/orders">
                            Mis pedidos
                          </Link>
                        </li>
                      )}

                      {/* Cerrar sesión */}
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menú de Navegación */}
      <div className="navbar navbar-light bg-white navbar-expand-lg border-bottom">
        <div className="container">
          <button
            className="navbar-toggler border"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar_main6"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"> </span>
          </button>
          <div className="collapse navbar-collapse" id="navbar_main6">
            <ul className="navbar-nav">
              <li className="nav-item">
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/sobrenosotros">
                  Sobre Nosotros
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="dropdown-toggle nav-link"
                  href="#"
                  data-bs-toggle="dropdown"
                >
                  Categorías
                </a>
                <ul className="dropdown-menu">
                  {categorias.length > 0 ? (
                    categorias.map((categoria) => (
                      <li key={categoria.id}>
                        <Link className="dropdown-item" to={`/categorias/${categoria.id}`}>
                          {categoria.nombre}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li>
                      <span className="dropdown-item text-muted">Cargando...</span>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
