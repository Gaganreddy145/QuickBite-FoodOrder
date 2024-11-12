import { createContext, useState } from "react";

export const CartContext = createContext({
  cart: [],
  totalPrice: 0,
  totalQuantity: 0,
  addToCart: (item) => {},
  setCart: () => {},
  removeFromCart: (id) => {},
});

export const CartContextProvider = ({ children }) => {
  const [cart, setCart] = useState({
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
  });

  const addToCart = (newItem) => {
    const foundItemIndex = cart.cartItems.findIndex(
      (item) => item.id === newItem.id
    );
    const updatedItems = [...cart.cartItems];
    if (foundItemIndex === -1) {
      const updatedItem = { ...newItem, quantity: 1 };
      updatedItems.push(updatedItem);
      setCart((prev) => {
        return {
          ...prev,
          cartItems: updatedItems,
          totalPrice: prev.totalPrice + updatedItem.price,
          totalQuantity: prev.totalQuantity + 1,
        };
      });
    } else {
      updatedItems[foundItemIndex].quantity++;
      setCart((prev) => {
        return {
          ...prev,
          cartItems: updatedItems,
          totalPrice: prev.totalPrice + updatedItems[foundItemIndex].price,
          totalQuantity: prev.totalQuantity + 1,
        };
      });
    }
  };

  const removeFromCart = (id) => {
    const foundItemIndex = cart.cartItems.findIndex((item) => item.id === id);

    const updatedItems = [...cart.cartItems];
    if (updatedItems[foundItemIndex].quantity === 1) {
      const removePrice = updatedItems[foundItemIndex].price;
      updatedItems.splice(foundItemIndex, 1);
      setCart((prev) => {
        return {
          ...prev,
          cartItems: updatedItems,
          totalPrice: prev.totalPrice - removePrice,
          totalQuantity: prev.totalQuantity - 1,
        };
      });
    } else {
      updatedItems[foundItemIndex].quantity--;
      setCart((prev) => {
        return {
          ...prev,
          cartItems: updatedItems,
          totalPrice: prev.totalPrice - updatedItems[foundItemIndex].price,
          totalQuantity: prev.totalQuantity - 1,
        };
      });
    }
  };

  const cartContextValue = {
    cart: cart.cartItems,
    totalPrice: cart.totalPrice,
    addToCart,
    removeFromCart,
    setCart,
    totalQuantity: cart.totalQuantity,
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};
