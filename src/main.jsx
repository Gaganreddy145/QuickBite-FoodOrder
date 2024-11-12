import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SearchContextProvider } from "./searchContext/SearchContext.jsx";
import { CartContextProvider } from "./cartContext/CartContextProvider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <CartContextProvider>
    <SearchContextProvider>
      <App />
    </SearchContextProvider>
  </CartContextProvider>
);
