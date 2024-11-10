import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ReduxProvider } from "./redux/Provider/ReduxProvider.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);
