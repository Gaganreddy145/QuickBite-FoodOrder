import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../searchContext/SearchContext";
import { CartContext } from "../cartContext/CartContextProvider";

function FoodItems() {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const {
    searchByInput,
    searchItems,
    setSearchItems,
    setData,
    data,
    searchByFilter,
  } = useContext(SearchContext);
  const { addToCart } = useContext(CartContext);

  const searchFoodItems = (value) => {
    setSearchInput(value);
    searchByInput(value);
  };

  const handleSearchByFilter = () => {
    searchByFilter("starter");
  };

  const handleAll = () => {
    setSearchItems(data);
  };

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setIsError({ status: false, msg: "" });
      try {
        const response = await fetch("http://localhost:3000/items");
        if (!response.ok) {
          //throw
          throw new Error("Unable to fetch resource");
        }
        const resData = await response.json();
        setIsLoading(false);
        setSearchItems(resData.items);
        setData(resData.items);
      } catch (e) {
        setIsLoading(false);
        console.log(e.message);
        setIsError({ status: true, msg: e.message });
      }
    };

    fetchItems();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {isError.status && <p>{isError.msg}</p>}
      {!isLoading && !isError.status && (
        <>
          <div className="choices">
            <div>
              <input
                type="text"
                onChange={(e) => searchFoodItems(e.target.value)}
                value={searchInput}
              />
            </div>
            <div>
              <ul id="filter">
                <li>
                  <button onClick={handleAll}>All</button>
                </li>
                <li>
                  <button onClick={handleSearchByFilter}>Starters</button>
                </li>
              </ul>
            </div>
          </div>

          {searchItems.length > 0 ? (
            <ul id="meals">
              {searchItems.map((item) => {
                const { id, fname, price, image, description } = item;
                return (
                  <li key={id} className="meal-item">
                    <article>
                      <Link to={`/${id}`}>
                        <img src={`http://localhost:3000/${image}`} />
                      </Link>
                      <div>
                        <h3>{fname}</h3>
                        <p className="meal-item-price">{price} /-</p>
                        <p className="meal-item-description">{description}</p>
                        <p className="meal-item-actions">
                          <button
                            className="button"
                            onClick={() => addToCart(item)}
                          >
                            Add To Cart
                          </button>
                        </p>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <h1
              style={{
                height: "60vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              No items found!!!
            </h1>
          )}
        </>
      )}
    </div>
  );
}

export default FoodItems;
