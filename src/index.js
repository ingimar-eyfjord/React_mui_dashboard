import React from "react";
import ReactDOM from "react-dom";
import Authenticate from "./authenticate";
import { StoreProvider } from "./context/store.js";
import "assets/css/material-dashboard-react.css?v=1.10.0";
import "./index.css";
import reportWebVitals from './reportWebVitals';
// Material Dashboard 2 React themes
// Material Dashboard 2 React Dark Mode themes

ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <Authenticate></Authenticate>
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals(console.log);
