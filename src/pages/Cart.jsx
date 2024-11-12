import React, { useContext, useState } from "react";
import { CartContext } from "../cartContext/CartContextProvider";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, addToCart, totalPrice, removeFromCart, setCart } =
    useContext(CartContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const handleCloseModal = () => {
    setIsModalOpen(undefined);
  };

  const handleOkay = () => {
    handleCloseModal();
    setCart({
      cartItems: [],
      totalPrice: 0,
      totalQuantity: 0,
    });
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const data = Object.fromEntries(fd.entries());
    const totalOrder = {
      data,
      orders: cart,
    };
    setIsSubmitting(true);
    setIsError({ status: false, msg: "" });
    try {
      const response = await fetch("http://localhost:3000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(totalOrder),
      });

      if (!response.ok) {
        throw new Error("Unable to submit");
      }
      const resData = await response.json();
      // setResponse(resData);
      setIsSubmitting(false);
      setIsModalOpen("success");
    } catch (error) {
      setIsSubmitting(false);
      setIsError({ status: true, msg: error.message });
      console.log(error.message);
    }
  };

  return (
    <div>
      <Modal
        open={isModalOpen === "details"}
        onClose={isModalOpen === "details" ? handleCloseModal : null}
      >
        <form onSubmit={handleSubmit}>
          <input type="text" name="fName" placeholder="FullName" required />
          <input
            type="number"
            name="table"
            placeholder="Table Number"
            min={1}
            max={20}
            required
          />
          <input
            type="text"
            name="phno"
            placeholder="Phone No."
            minLength={10}
            maxLength={10}
          />
          {isError.status && <p>{isError.msg}</p>}
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Checkout"}
          </button>
        </form>
        <button onClick={handleCloseModal}>Close</button>
      </Modal>
      <Modal open={isModalOpen === "success"} onClose={handleCloseModal}>
        <h1>Your Order placed Successfully</h1>
        <button onClick={handleOkay}>Okay</button>
      </Modal>
      {cart.length > 0 ? (
        <>
          <ul>
            {cart.map((item) => {
              const { fname, price, quantity, id } = item;

              return (
                <li key={id} className="cart-item">
                  <p>
                    {fname} - {quantity}
                  </p>
                  <p>Price:{price}</p>
                  <p className="cart-item-actions">
                    <button onClick={() => removeFromCart(id)}>-</button>

                    <span>{quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </p>
                </li>
              );
            })}
          </ul>
          <h3>Total Price : {totalPrice}</h3>
          <button onClick={() => setIsModalOpen("details")}>
            Proceed To Checkout
          </button>
        </>
      ) : (
        <h1
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          No Items in cart
        </h1>
      )}
    </div>
  );
}

export default Cart;
