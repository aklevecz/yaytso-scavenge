import { Link, useLocation } from "react-router-dom";

const dim = 25

const links = [
  {
    name: "Map",
    component: <div style={{ width: dim, height: dim, transform: "rotate(45deg)" }}></div>,
    path: "/map",
  },
  {
    name: "Egg",
    component: <div style={{ width: dim, height: dim, borderRadius: 30 }}></div>,
    path: "/",
  },
  {
    name: "Wallet",
    component: <div style={{ width: dim, height: dim, borderRadius: 0 }}></div>,
    path: "/wallet"
  },
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
          {link.component}
        </Link>
      ))}
    </div>
  );
}
