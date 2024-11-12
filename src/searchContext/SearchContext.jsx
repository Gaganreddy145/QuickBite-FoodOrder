import { createContext, useState } from "react";
export const SearchContext = createContext({
  searchItems: [],
  data: [],
  setData: () => {},
  searchByFilter: (filter) => {},
  searchByInput: (value) => {},
  setSearchItems: () => {},
});

export const SearchContextProvider = ({ children }) => {
  const [searchItems, setSearchItems] = useState([]);
  const [data, setData] = useState([]);

  const searchByInput = (value) => {
    let newItems = [];
    data.forEach((item) => {
      const { fname } = item;
      if (fname.toLowerCase().includes(value.toLowerCase())) {
        newItems.push(item);
      }
    });
    setSearchItems(newItems);
  };

  const searchByFilter = (filter) => {
    let newItems = [];
    data.forEach((item) => {
      const { category } = item;
      if (category === filter) {
        newItems.push(item);
      }
    });
    // console.log(newItems);
    setSearchItems(newItems);
  };

  const searchContextValue = {
    searchItems,
    data,
    setData,
    searchByFilter,
    searchByInput,
    setSearchItems,
  };

  return (
    <SearchContext.Provider value={searchContextValue}>
      {children}
    </SearchContext.Provider>
  );
};
