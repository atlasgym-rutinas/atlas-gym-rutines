import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";

export default function Barra({ to, children }) {
  return (
    <div className="barra">
      <Link className="volver" to={to}>
        <Icon name="back" /> {children}
      </Link>
    </div>
  );
}
