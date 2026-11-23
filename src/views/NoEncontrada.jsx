import { Link } from "react-router-dom";
import Barra from "../components/Barra.jsx";

export default function NoEncontrada() {
  return (
    <>
      <title>Atlas Gym Rutinas</title>
      <Barra to="/">Inicio</Barra>
      <h1 className="titulo" tabIndex={-1} data-foco="">
        No está
      </h1>
      <p className="no-encontrado">
        Esta rutina ya no existe o el enlace está incompleto. <Link to="/">Volvé al inicio</Link> para elegir otra.
      </p>
    </>
  );
}
