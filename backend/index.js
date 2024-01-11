import bodyParser from "body-parser";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import mongoose from "mongoose";

// for static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticPath = path.join(__dirname, "../public");
// server variables
const app = express();
const http = createServer(app);

app.use(bodyParser.json());
app.use(express.static(staticPath));

// connnecting to the db

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/test")

        console.log("Mongodb connect");
    } catch (error) {
        console.log("Failed",error);
    }
}
connectDB()
http.listen(3000, () => {
  console.log("server is running");
});
