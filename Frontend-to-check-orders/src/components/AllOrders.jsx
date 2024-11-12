import React, { useEffect, useState } from "react";
import Modal from "./Modal";
const formatOrderedTime = (ordered_on) => {
  const utcDate = ordered_on;
  const localDate = new Date(utcDate);

  // Convert to local time and extract the time
  const localTime = localDate.toLocaleTimeString("en-US", {
    hour12: false,
    timeZoneName: "short",
  });

  const hrMinSec = localTime.split(" ")[0].split(":");
  let hrMin = "";
  for (let i = 0; i < hrMinSec.length - 1; i++) {
    if (i === 1) {
      hrMin = hrMin + ":";
    }
    hrMin += hrMinSec[i];
  }

  return hrMin;
};
// const orders = [
//   {
//     19: [
//       {
//         uname: "Gagan",
//         phno: "1234567890",
//         fid: 1,
//         fdname: "Rice",
//         quant: 2,
//       },
//       {
//         uname: "Gagan",
//         phno: "1234567890",
//         fid: 2,
//         fdname: "Chicken lollipop",
//         quant: 2,
//       },
//       {
//         uname: "Gagan",
//         phno: "1234567890",
//         fid: 3,
//         fdname: "Mojito",
//         quant: 2,
//       },
//       { uname: "Gagan", phno: "1234567890", fid: 4, fdname: "Rice", quant: 2 },
//     ],
//   },
//   {
//     1: [
//       { uname: "Eswar", phno: "0987654321", fid: 7, fdname: "Rice", quant: 2 },
//     ],
//   },
// ];
function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [isModalOpen, setIsModal] = useState(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      setIsLoading(true);
      setIsError({ status: false, msg: "" });
      try {
        const response = await fetch("http://localhost:3000/show-orders");
        if (!response.ok) {
          throw new Error("Unable to fetch orders");
        }

        const resData = await response.json();
        setOrders(resData.allOrders);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
        console.log(error.message);
      }
    };

    fetchAllOrders();
  }, []);

  const handleDeleteTable = async (tableNo) => {
    const newOrders = JSON.parse(JSON.stringify(orders));
    const updatedOrders = [];
    newOrders.forEach((order) => {
      const [tableNumber] = Object.keys(order);
      if (tableNumber != tableNo) {
        updatedOrders.push(order);
      }
    });

    setOrders(updatedOrders);
    try {
      const response = await fetch(
        "http://localhost:3000/delete-table/" + tableNo,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Unable to delete");
      }
    } catch (error) {
      console.log(error.message);
      setOrders(orders);
      setIsModal("error");
    }
  };

  const handleCloseModal = () => {
    setIsModal(null);
  };

  // const handleOpenDeleteModal = () => {
  //   setIsModal("delete");
  // };

  const handleIndividualDelete = async (fid, phno, tableNumber) => {
    const newOrders = JSON.parse(JSON.stringify(orders));
    newOrders.forEach((orderTno, index) => {
      const [tableNo] = Object.keys(orderTno);
      if (tableNo == tableNumber) {
        const insideOrders = newOrders[index][tableNo].filter(
          (o) => o.fid != fid
        );
        newOrders[index][tableNo] = insideOrders;
      }
      if (newOrders[index][tableNo].length === 0) {
        newOrders.splice(index, 1);
      }
    });

    setOrders(newOrders);

    try {
      const response = await fetch("http://localhost:3000/delete-individual", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid, phno, tableNumber }),
      });

      if(!response.ok){
        throw new Error("Unable to delete!!!");
      }
    
    } catch (error) {
      setOrders(orders);
      setIsModal("error");
    }
  };

  return (
    <div>
      <h1>AllOrders</h1>
      <Modal
        open={isModalOpen === "error"}
        onClose={isModalOpen === "error" ? handleCloseModal : null}
      >
        <h1>Unable to delete...</h1>
        <p>An error occured!!!</p>
        <button onClick={handleCloseModal}>Close</button>
      </Modal>
      {/* <Modal open={isModalOpen === "delete"} onClose={handleCloseModal}>
        <h1>Do you want to delete?</h1>
        <button onClick={}></button>
      </Modal> */}
      {isLoading && <p>Loading...</p>}
      {isError.status && <p>{isError.msg}</p>}
      {!isLoading &&
        !isError.status &&
        (orders.length > 0 ? (
          <ul>
            {orders.map((table) => {
              const [tableNumber] = Object.keys(table);
              return (
                <li key={tableNumber}>
                  <button onClick={() => handleDeleteTable(tableNumber)}>
                    Delete {tableNumber}
                  </button>
                  <ul>
                    {table[tableNumber].map((tableOrders) => {
                      const { fid, uname, fdname, quant, phno, ordered_on } =
                        tableOrders;
                      let hrMin = formatOrderedTime(ordered_on);
                      return (
                        <li key={fid}>
                          <button
                            onClick={() =>
                              handleIndividualDelete(fid, phno, tableNumber)
                            }
                          >
                            Done
                          </button>
                          <h3>Food:{fdname}</h3>
                          <h4>Ordered on {hrMin}</h4>
                          <h4>Name:{uname}</h4>
                          <h4>Quantity:{quant}</h4>
                          <h4>PHONE:{phno}</h4>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No Orders</p>
        ))}
    </div>
  );
}

export default AllOrders;
