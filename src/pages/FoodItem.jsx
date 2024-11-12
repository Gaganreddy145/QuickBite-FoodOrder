import React, { useContext } from "react";
import { json, useLoaderData, useParams } from "react-router-dom";
import { CartContext } from "../cartContext/CartContextProvider";
function FoodItem() {
  const params = useParams();
  const data = useLoaderData();
  const {addToCart} = useContext(CartContext);
  const item = {
    id: data.data.id,
    fname: data.data.fname,
    price: data.data.price,
    image: data.data.image,
  };
  
  
  
  return (
    <div>
      <h1>FoodItem</h1>
      <h2>Id:{params.itemId}</h2>
      <img
        style={{ width: "200px", height: "200px" }}
        src={`http://localhost:3000/${data.data.image}`}
        alt=""
      />
      <h2>Name:{data.data.fname}</h2>
      <p>{data.data.description}</p>
      <p>Price: {data.data.price}</p>
      <button onClick={() => addToCart(item)}>Add to cart</button>
    </div>
  );
}

export const loader = async ({ request, params }) => {
  const itemId = params.itemId;
  const response = await fetch(
    "http://localhost:3000/individual-item/" + itemId
  );
  if (!response.ok) {
    throw json(
      { message: "Unable to load the requested item" },
      {
        status: 404,
      }
    );
  }

  return response;
};
export default FoodItem;
