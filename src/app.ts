import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();

interface ResponseError extends Error {
  status?: number;
}

app.use(express.json()); // body parser

app.get("/", (req: Request, res: Response) => {
  res.send("ChowBread Backend");
});

app.use(
  (err: ResponseError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message =
      err.message || "Something went wrong, please try again later!";
    return res.status(status).json({
      success: false,
      status,
      message,
    });
  }
);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
