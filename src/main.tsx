import React from "react";
import ReactDOM from "react-dom/client";
import Frame from "./frame";
import "./global.scss";

import { ThemeProvider } from "@insd47/library";

ReactDOM.createRoot(document.getElementById("frame") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <Frame />
    </ThemeProvider>
  </React.StrictMode>
);
