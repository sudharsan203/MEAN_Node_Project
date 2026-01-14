const http = require("http");
const fs = require("fs");
const express = require("express");
const { MongoClient } = require('mongodb');
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

const app = express();
const PORT = 5000;

async function testConnection() {
  try {
    await client.connect();
    console.log("Connected to MongoDB successfully!");

    const db = client.db("MobileECommerce");
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

testConnection();
let mobiles = [
  { id: 1, brand: "Apple", model: "iPhone 13" },
  { id: 2, brand: "Samsung", model: "Galaxy S21" },
  { id: 3, brand: "Google", model: "Pixel 6" },
  { id: 4, brand: "OnePlus", model: "9 Pro" },
  { id: 5, brand: "Sony", model: "Xperia 1 III" }
];

app.get("/", (req, res) => {
  res.send("Hello, Secure World!");
});

app.get("/healthCheck", (req, res) => {
    let response = {
        name:"Success",
        message:"Server is healthy"
    }
    res.send(response);
});
app.get("/mobileslist", (req, res) => {
  res.header("Content-Type", "application/json");
  res.header("Access-Control-Allow-Origin", "*");
    res.send(mobiles);
});
app.post("/addmobile", express.json(), (req, res) => {
  console.log("Req Information", req.body, req.url, req.method);
    const newMobile = {
        id: mobiles.length + 1,
        brand: req.body.brand,
        model: req.body.model
    };
    mobiles.push(newMobile);
    res.send({ message: "Mobile added successfully", mobilesList: mobiles  });
});

app.put("/updatemobile/:id", express.json(), (req, res) => {
    const mobileId = parseInt(req.params.id); //8
  const mobile = mobiles.find(m => m.id === mobileId); //{ id: 2, brand: "Samsung", model: "Galaxy S21" }
    if (mobile) {
        mobile.brand = req.body.brand || mobile.brand;
        mobile.model = req.body.model || mobile.model;
        res.send({ message: "Mobile updated successfully", mobile });
    } else {
        res.status(404).send({ message: "Mobile not found" });
    }
});
app.delete("/deletemobile/:id", (req, res) => {
    const mobileId = parseInt(req.params.id);
    const index = mobiles.findIndex(m => m.id === mobileId);//1
    if (index !== -1) {
        mobiles.splice(index, 1);
        // delete mobiles[index];
        res.send({ message: "Mobile deleted successfully", mobilesList: mobiles });
    } else {
        res.status(404).send({ message: "Mobile not found" });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// const server =  http.createServer(
//   (req, res) => {
    
//     if (req.url === "/") {
//         res.writeHead(200, { 'Content-Type': 'text/plain' });
//         res.end('Hello, Secure World!');
//     } else if (req.url === "/healthCheck") {
//         let response = {
//             name: "Success",
//             message: "Server is healthy"
//         };
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(response));
//     } else if (req.url === "/mobileslist") {
//         let mobiles = [
//             { id: 1, brand: "Apple", model: "iPhone 13" },
//             { id: 2, brand: "Samsung", model: "Galaxy S21" },
//             { id: 3, brand: "Google", model: "Pixel 6" }
//         ];
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify(mobiles));
//     }
// }
// );

// server.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

// CRUD -> Create, Read, Update, Delete

// GET -> Get the data from database
// POST -> Create new data in database
// PUT -> Update the existing data in database
// DELETE -> Delete the existing data from database