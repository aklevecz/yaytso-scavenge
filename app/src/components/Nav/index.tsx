import { Link, useLocation } from "react-router-dom";

const links = [
  {
    name: "Map",
    path: "/map",
  },
  {
    name: "Egg",
    path: "/",
  },
  { name: "Wallet", path: "/wallet" },
];

export default function Nav() {
  const location = useLocation();

  return (
    <div className="nav">
      {links.map((link) => (
        <Link
          className={location.pathname === link.path ? "active" : ""}
          key={link.path}
          to={link.path}
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
}
