import { createRoot } from "react-dom/client";
import { createElement } from "react";
import IndustriesServeApp from "../src/industries-serve/IndustriesServeApp.web.tsx";

const el = document.getElementById("root");
if (el) createRoot(el).render(createElement(IndustriesServeApp));
