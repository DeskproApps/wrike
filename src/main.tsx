import React from "react";
import ReactDOM from "react-dom/client";
import { DeskproAppProvider } from "@deskpro/app-sdk";
import App from "./App";

import "iframe-resizer/js/iframeResizer.contentWindow.js";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <React.StrictMode>
    <DeskproAppProvider>
      <App />
    </DeskproAppProvider>
  </React.StrictMode>
);
