import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
const port = 3000;
dotenv.config();
// const items = [
//   {
//     // id: "i1",
//     fname: "Dosa",
//     category: "tiffin",
//     price: 100.0,
//     image: "dosa.jpg",
//     descripton: "Dosa is a south indian food",
//   },
//   {
//     // id: "i2",
//     fname: "Idli",
//     category: "tiffin",
//     price: 70.0,
//     image: "idli.jpg",
//     descripton: "Idli is a south indian food",
//   },
//   {
//     // id: "i3",
//     fname: "Rice",
//     category: "main course",
//     price: 100.0,
//     image: "rice.jpg",
//     descripton: "Rice is a south indian food",
//   },
//   {
//     // id: "i4",
//     fname: "Chicken Lollipop",
//     category: "starter",
//     price: 120.0,
//     image: "chickenlollipop.jpg",
//     descripton: "Chicken Lollipop is a south indian food",
//   },
//   {
//     // id: "i5",
//     fname: "Mojito",
//     category: "drinks",
//     price: 120.0,
//     image: "mojito.jpg",
//     descripton: "Mojito is a drink",
//   },
// ];

const db = new pg.Client({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.PORT,
});

db.connect();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/items", async (req, res) => {
  try {
    const response = await db.query("SELECT * FROM fooditems");
    const foodData = response.rows;
    const foodDataUpdated = [];
    foodData.forEach((item) => {
      const { price } = item;
      const data = { ...item, price: parseFloat(price) };
      foodDataUpdated.push(data);
    });
    res.status(201).json({ items: foodDataUpdated });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "No Data Found" });
  }
});

app.get("/individual-item/:itemId", async (req, res) => {
  const itemID = Number(req.params.itemId);
  if (itemID) {
    try {
      const response = await db.query(
        "SELECT fname,image,description,price FROM fooditems WHERE id=$1",
        [itemID]
      );

      if (response.rowCount === 0) {
        throw new Error("Unable to find!!!");
      }

      const requestedItem = response.rows[0];
      requestedItem.price = parseFloat(requestedItem.price);
      const item = {
        ...requestedItem,
        id: itemID,
      };
      res.status(201).json({ data: item });
    } catch (error) {
      console.log(error.message);
      res.status(404).json({ message: "No item found" });
    }
  } else {
    res.status(404).json({ message: "No item found" });
  }
});

app.get("/show-orders", async (req, res) => {
  try {
    const response = await db.query(
      "SELECT t.id,od.uname,od.phno,fd.fid,fd.fdname,fd.quant,fd.ordered_on from tableno AS t JOIN orderusers AS od ON od.tid = t.id JOIN food AS fd ON fd.ouphno = od.phno"
    );
    const resData = response.rows;
    const allOrders = [];
    resData.forEach((order) => {
      const { id } = order;
      const foundTableIndex = allOrders.findIndex(
        (ao) => Object.keys(ao)[0] == id
      );
      if (foundTableIndex === -1) {
        const newItem = { [id]: [order] };
        allOrders.push(newItem);
      } else {
        allOrders[foundTableIndex][id].push(order);
      }
    });
    res.status(200).json({ allOrders });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Unable to find orders" });
  }
});

app.post("/order", async (req, res) => {
  const { data, orders } = req.body;
  const userDetails = data;

  const constructValues = () => {
    const values = [];
    orders.forEach((order) => {
      const { id, fname, quantity } = order;
      const singleValue = `(${id},'${fname}',${quantity},'${userDetails.phno}')`;
      values.push(singleValue);
    });
    return values;
  };

  try {
    await db.query("BEGIN");

    const isTableAvailable = await db.query(
      "SELECT * FROM tableno WHERE id=$1",
      [Number(userDetails.table)]
    );
    if (isTableAvailable.rowCount === 0) {
      await db.query("INSERT INTO tableno VALUES($1)", [
        Number(userDetails.table),
      ]);
      await db.query("INSERT INTO orderusers VALUES($1,$2,$3)", [
        userDetails.fName,
        userDetails.phno,
        Number(userDetails.table),
      ]);
      let ordersToBeInserted =
        "INSERT INTO food(foodid,fdname,quant,ouphno) VALUES ";
      const values = constructValues();
      ordersToBeInserted += values.join();
      await db.query(ordersToBeInserted);
    } else {
      const isSameUser = await db.query(
        "SELECT * FROM orderusers WHERE phno=$1",
        [userDetails.phno]
      );
      if (isSameUser.rowCount === 0) {
        await db.query("INSERT INTO orderusers VALUES($1,$2,$3)", [
          userDetails.fName,
          userDetails.phno,
          Number(userDetails.table),
        ]);

        let ordersToBeInserted =
          "INSERT INTO food(foodid,fdname,quant,ouphno) VALUES ";
        const values = constructValues();
        ordersToBeInserted += values.join();
        await db.query(ordersToBeInserted);
      } else {
        //await db.query("INSERT");
        let ordersToBeInserted =
          "INSERT INTO food(foodid,fdname,quant,ouphno) VALUES ";
        const values = constructValues();
        ordersToBeInserted += values.join();
        await db.query(ordersToBeInserted);
      }
    }
    await db.query("COMMIT");
    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error.message);
    await db.query("ROLLBACK");
    res.status(404).json({ message: "Unable to post" });
  }
});

app.delete("/delete-table/:tno", async (req, res) => {
  try {
    await db.query("DELETE FROM tableno WHERE id=$1", [Number(req.params.tno)]);
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ message: "Unable to delete" });
  }
});

app.delete("/delete-individual", async (req, res) => {
  const { fid, phno, tableNumber } = req.body;

  try {
    await db.query("BEGIN");
    await db.query("DELETE FROM food WHERE fid=$1", [fid]);
    const isPhno = await db.query("SELECT * FROM food WHERE ouphno=$1", [phno]);
    if (isPhno.rowCount === 0) {
      await db.query("DELETE FROM orderusers WHERE phno=$1", [phno]);
      const isTable = await db.query("SELECT * FROM orderusers WHERE tid=$1", [
        Number(tableNumber),
      ]);
      if (isTable.rowCount === 0) {
        await db.query("DELETE FROM tableno WHERE id=$1", [
          Number(tableNumber),
        ]);
      }
    }

    await db.query("COMMIT");
    res.status(200).json({ message: "successfully deleted" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.log(error.message);
    res.status(404).json({ message: "Unable to DELETE" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
