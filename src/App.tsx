//React Imports
import { hot } from "react-hot-loader";
import React, { FC } from "react";

// Pages
import Home from "./Pages/Home";

// Components
import Popup from "./Components/Popup";
import Navbar from "./Components/Navbar";

//Router Imports
import { Switch, Route } from "react-router-dom";

const App: FC = () => {
  return (
    <>
      <Popup />
      <Navbar />
      <Routes />
    </>
  );
};

const Routes: FC = () => {
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};

//Hot Loader reloads the app when you save changes
export default hot(module)(App);
