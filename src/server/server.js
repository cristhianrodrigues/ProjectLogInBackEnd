import express from "express";
import cors from "cors";
import authRoutes from "../routes/authRoutes.js";


const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).send("API LogIn...");
});


app.listen(port, () => {
    console.log(`Server rodando na porta: ${port}`);
});