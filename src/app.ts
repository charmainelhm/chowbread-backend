import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRouter from "./routers/user-router.js";
import sessionRouter from "./routers/session-router.js";
import expenseRouter from "./routers/expense-router.js";
import cors from "cors";
dotenv.config();
const app = express();

interface ResponseError extends Error {
  status?: number;
}

app.use(express.json()); // body parser
app.use(cors({ origin: true, credentials: true }));

app.use("/api/user", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/expense", expenseRouter);

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
