import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { CartContext } from "../cartContext/CartContextProvider";

function MainNavigation() {
  const { totalQuantity } = useContext(CartContext);

  return (
    <header>
      <nav>
        <ul id="main-header">
          <li>
            <NavLink to="/">Items</NavLink>
          </li>
          <li>
            <NavLink to="/cart">Cart ({totalQuantity})</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
