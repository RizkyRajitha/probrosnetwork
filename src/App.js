import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// import { Listdemo } from "./pages/demo";
import Landing from "./pages/landing/landing";
import Graph from "./pages/graph/gaph";

//Import CSS module
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/graph" component={Graph} />
      </Switch>
    </Router>
  );
}

export default App;
