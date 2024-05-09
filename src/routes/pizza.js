import express from "express";
import { uploadImage } from "../utils/multerConf.js"
import jwt from "../utils/jwt.js"
import isAdmin from "../utils/isAdmin.js"
import { validate, createPizza, getPizzas, getPizzaById, updatePizza, deletePizza } from "../controllers/pizza.js"

const router = express.Router();


// create 
router.post("/", jwt.verifyToken, isAdmin, uploadImage, validate.createPizza, createPizza);

// read 
router.get("/", validate.getPizzas, getPizzas);
router.get("/:id", validate.getPizzaById, getPizzaById);

// update 
router.put("/:id", jwt.verifyToken, isAdmin, uploadImage, validate.updatePizza, updatePizza);

// delete 
router.delete("/:id", jwt.verifyToken, isAdmin, validate.deletePizza, deletePizza);


export default router;