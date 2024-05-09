import { body, query, param, check, validationResult } from 'express-validator';
import Pizza from "../models/Pizza.js"
import deleteImg from '../utils/deleteImg.js';
import { strgPath } from "../utils/multerConf.js" 


export const validate = {
  createPizza: [
    check('image').custom((value, { req }) => {
      if(!req.file){
        return false
      };

      return true
    }).withMessage("Image is not provided"),
  
    body("name").trim().notEmpty().escape(),
    body("ingredients").custom((value, { req }) => {
      const ingredients = JSON.parse(value);
     
      if(Array.isArray(ingredients) && ingredients.length > 0){
        return true;
      };
      
      return false;
    }),
    body("description").optional().trim().escape(),
    body("price").trim().notEmpty().escape().isNumeric()
  ],
  getPizzas: [
    query('q').optional().trim().notEmpty().escape(),
    
    query('limit').trim().notEmpty().escape().isNumeric(),
    query('offset').trim().notEmpty().escape().isNumeric()
  ],
  getPizzaById: [
    param("id").trim().notEmpty().escape()
  ],
  updatePizza: [
    param("id").trim().notEmpty().escape(),

    check('image').optional().custom((value, { req }) => {
      if(!req.file){
        return false
      };

      return true
    }).withMessage("Image is not provided"),

    body("name").optional().trim().escape(),
    body("ingredients").optional().custom((value, { req }) => {
      const ingredients = JSON.parse(value);
     
      if(Array.isArray(ingredients) && ingredients.length > 0){
        return true;
      };
      
      return false;
    }),

    body("description").optional().trim().escape(),
    body("price").optional().trim().escape().isNumeric()
  ],
  deletePizza: [
    param("id").trim().notEmpty().escape()
  ]
};



export const createPizza = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    const imgfileName = req.file.filename;

    const obj = {
      name: req.body.name, 
      image: imgfileName,
      ingredients: JSON.parse(req.body.ingredients), 
      description: req.body.description,
      price: req.body.price
    };


    const newPizza = new Pizza(obj);
    await newPizza.save();

    res.status(201).json({
      success: true,
      result: newPizza 
    });
    
  } catch (err) {
    res.json({
      success: false,
      errors: err 
    });
  }
}



export const getPizzas = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    const search = {};

    if(req.query.q){
      search.name = new RegExp(req.query.q, "i") 
    }

    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);

    const result = await Pizza.find(search).skip(offset).limit(limit).sort({ createdAt: "descending" });

    for (const itemObj of result) {
      itemObj.image = process.env.BACKEND_URL + "/v1/imgs/" + itemObj.image 
    }

    res.json({
      success: true,
      result: result  
    });
    
  } catch (err) {
    res.json({
      success: false,
      errors: err 
    });
  }
}


export const getPizzaById = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    const id = req.params.id;
    let result = await Pizza.findById(id);
    
    result.image = process.env.BACKEND_URL + "/v1/imgs/" + result.image
    
    res.json({
      success: true,
      result: result  
    });
    
  } catch (err) {
    res.json({
      success: false,
      errors: err 
    });
  }
}


export const updatePizza = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }


    const imgfileName = req.file?.filename;
    const ingredients = req.body.ingredients && JSON.parse(req.body.ingredients) 

    const obj = {
      name: req.body.name, 
      image: imgfileName,
      ingredients: ingredients, 
      description: req.body.description,
      price: req.body.price
    };

    
    for(const item of Object.keys(obj)){
      if(obj[item] === undefined){
        delete obj[item]
      }; 
    }
    
    if(Object.keys(obj).length === 0){
      throw "Specify fields to update"
    };

    const id = req.params.id;

    // deleting old image
    if(obj.image){
      const tempObj = await Pizza.findById(id, "image");

      deleteImg(`${strgPath}/${tempObj.image}`)
    }

    const result = await Pizza.findByIdAndUpdate(id, obj, { new: true })

    res.json({
      success: true,
      result: result  
    });
    
  } catch (err) {
    res.json({
      success: false,
      errors: err 
    });
  }
}


export const deletePizza = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    
    const id = req.params.id;
    const obj = await Pizza.findById(id, "image");

    deleteImg(`${strgPath}/${obj.image}`)

    const result = await Pizza.findByIdAndDelete(id);
    
    res.json({
      success: true,
      result: result  
    });
    
  } catch (err) {
    res.json({
      success: false,
      errors: err 
    });
  }
}