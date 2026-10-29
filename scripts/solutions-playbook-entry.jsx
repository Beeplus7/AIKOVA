import { createRoot } from "react-dom/client";
import { createElement } from "react";
import SolutionsPlaybookApp from "../src/solutions-playbook/SolutionsPlaybookApp.web.tsx";

const el = document.getElementById("root");
if (el) createRoot(el).render(createElement(SolutionsPlaybookApp));
