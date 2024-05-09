import express from "express"
import cors from "cors"; 
import helmet from "helmet"; 
import connectDb from "./utils/connectDb.js"
import { strgPath } from "./utils/multerConf.js";
import pizzaRoutes from "./routes/pizza.js"
import authRoutes from "./routes/auth.js"
import 'dotenv/config'


const app = express();

connectDb();

// middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// routes
app.use("/v1/pizzas", pizzaRoutes)
app.use("/v1/auth", authRoutes)
app.use('/v1/imgs', express.static(strgPath))


const port = process.env.PORT || 3000; 
app.listen(port, () => console.log(`App listening on port ${port}`))