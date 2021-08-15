import "./App.css";
import Routes from "./Routes";
import Modal from "./containers/Modal";
import { useUser } from "./contexts/UserContext";

function App() {
  const user = useUser();
  return (
    <div className="App">
      {user.phone && <div>{user.phone}</div>}
      <Routes />
      <Modal />
    </div>
  );
}

export default App;
