const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Local = require("./localModel");

// Define the GET route
router.get("/", async (req, res) => {
   try {
     console.log("inside get freguesias for Águeda");

     // Query the MongoDB collection to get freguesias for Águeda
     const freguesiasForAgueda = await Local.find(
       { municipios: "Águeda" },
       { freguesias: 1, _id: 0 }
     );

     console.log("freguesiasForAgueda");
     res.status(200).json(freguesiasForAgueda);
   } catch (err) {
     console.error("Error", err);
     res.status(500).json({ error: "Something went wrong" });
   }
});

module.exports = router;
