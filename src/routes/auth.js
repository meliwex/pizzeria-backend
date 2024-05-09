import express from "express"
import { validate, signUp, login } from "../controllers/auth.js"

const router = express.Router()


router.post("/signup", validate.signUp, signUp);

router.post("/login", validate.login, login);


export default router