//React Imports
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { SnackbarProvider } from "notistack";

// Redux Imports
import ReduxStore from "./Store";

//Material UI Imports
import Theme from "./Theme";

// Misc Imports
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <ReduxStore>
      <Router>
        <Theme>
          <SnackbarProvider>
            <App />
          </SnackbarProvider>
        </Theme>
      </Router>
    </ReduxStore>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
