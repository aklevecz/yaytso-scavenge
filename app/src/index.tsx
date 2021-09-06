import ReactDOM from "react-dom";
import "./index.css";
import "./styles/transitions.css";
import "./styles/modal.css";
import "./styles/overlay.css";
import "./styles/nav.css";
import "./styles/wallet.css";

import App from "./App";
import { MapProvider } from "./contexts/MapContext";
import { ModalProvider } from "./contexts/ModalContext";
import { CartonProvider } from "./contexts/CartonContext";
import { UserProvider } from "./contexts/UserContext";

ReactDOM.render(
  <ModalProvider>
    <CartonProvider>
      <MapProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </MapProvider>
    </CartonProvider>
  </ModalProvider>,
  document.getElementById("root")
);
