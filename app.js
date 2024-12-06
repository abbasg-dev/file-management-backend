import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

// import routes
import authRoutes from "./routes/authRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";

dotenv.config();

connectDB();

const app = express();

const api = process.env.API_URL;

// app middlewares
app.use(morgan("dev"));
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use(errorHandler);
app.use("/uploads", express.static("uploads"));

app.use(`${api}/auth`, authRoutes);
app.use(`${api}/files`, fileRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
