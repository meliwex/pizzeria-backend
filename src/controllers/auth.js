import { body, validationResult } from 'express-validator';
import bcrypt from "bcrypt"
import jwt from "../utils/jwt.js"
import User from "../models/User.js"

export const validate = {
  signUp: [
    body("firstName").trim().notEmpty().escape(),
    body("lastName").trim().notEmpty().escape(),
    body("email").optional().trim().notEmpty().escape().isEmail(),
    body("phone").trim().notEmpty().escape().isMobilePhone("am-AM"),
    body("password").notEmpty().escape().isStrongPassword(),
  ],
  login: [
    body("phone").trim().notEmpty().escape().isMobilePhone("am-AM"),
    body("password").notEmpty().escape(),
  ]
}

export const signUp = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const obj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: hashedPassword 
    };
    
    const newUser = new User(obj);
    await newUser.save();

    const token = jwt.generateToken(newUser._id);

    res.cookie('tk', token)
    res.status(201).json({
      success: true,
      result: newUser 
    });

  } catch (err) {
    res.json({
      success: false,
      errors: err
    });
  }
}


export const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    
    const errMsg = "Incorrect phone or password" 

    const user = await User.findOne({ phone: req.body.phone }).select("+password");
    
    if(user === null){
      throw errMsg
    }
    
    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if(isMatch === false) {
      throw errMsg
    }


    const token = jwt.generateToken(user._id);

    res.cookie('tk', token)
    res.json({
      success: true,
      result: user 
    });

  } catch (err) {
    res.json({
      success: false,
      errors: err
    });
  }
}