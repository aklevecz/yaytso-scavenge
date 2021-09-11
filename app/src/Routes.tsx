import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Egg from "./containers/Egg";
import { ThreeProvider } from "./contexts/ThreeContext";
import { PatternProvider } from "./contexts/PatternContext";
import Nav from "./components/Nav";

export default function Routes() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/wallet">
          <Wallet />
        </Route>
        <Route path="/map" component={Map} />
        <Route path="/">
          <PatternProvider>
            <ThreeProvider>
              <Egg />
            </ThreeProvider>
          </PatternProvider>
        </Route>
      </Switch>
    </Router>
  );
}
