import { useHistory } from "react-router-dom";
import NavButton from "../../components/buttons/NavButton";
export default function Nav() {
  const history = useHistory();
  return (
    <div className="nav__container">
      <NavButton name="Wallet" onClick={() => history.push("/wallet")} />
    </div>
  );
}
