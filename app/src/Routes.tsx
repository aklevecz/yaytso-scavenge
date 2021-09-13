import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Egg from "./containers/Egg";
import { ThreeProvider } from "./contexts/ThreeContext";
import { PatternProvider } from "./contexts/PatternContext";
import Nav from "./components/Nav";
import { useLoading } from "./contexts/UserContext";
import DotTyping from "./components/Loading/DotTyping";

const AppComponents = () => (
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
)

export default function Routes() {
  const loading = useLoading()
  return (
    <Router>
      <Nav />
      {loading && <DotTyping />}
      {!loading && <AppComponents />}
    </Router>
  );
}
