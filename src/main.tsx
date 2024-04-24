import React from "react";
import ReactDOM from "react-dom/client";
import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "./index.css";
import App from "./App";
import { DeskproAppProvider } from "@deskpro/app-sdk";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <DeskproAppProvider>
      <App />
    </DeskproAppProvider>
  </React.StrictMode>
);
