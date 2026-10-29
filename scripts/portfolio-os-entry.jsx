import { createRoot } from "react-dom/client";
import { createElement } from "react";
import PortfolioOsApp from "../src/portfolio-os/PortfolioOsApp.web.tsx";

const el = document.getElementById("root");
if (el) createRoot(el).render(createElement(PortfolioOsApp));
