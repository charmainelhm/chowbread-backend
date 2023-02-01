import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

app.use(express.json()); // body parser

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
