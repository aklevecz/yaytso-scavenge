import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/modal.css";
import "./styles/overlay.css";
import "./styles/nav.css";
import "./styles/wallet.css";

import App from "./App";
import { ContractProvider } from "./contexts/ContractContext";
import { MapProvider } from "./contexts/MapContext";
import { ModalProvider } from "./contexts/ModalContext";
import { CartonProvider } from "./contexts/CartonContext";

ReactDOM.render(
  <ModalProvider>
    <ContractProvider>
      <CartonProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </CartonProvider>
    </ContractProvider>
  </ModalProvider>,
  document.getElementById("root")
);
