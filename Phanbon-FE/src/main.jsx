import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('load', function() {
      const loader = document.querySelector('.loader-bg');
      if (loader) {
          loader.classList.add('loader-hidden');
      }
  });
});