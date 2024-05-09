import User from "../models/User.js"


const isAdmin = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if(user.role !== "admin") {
      throw "Forbidden"
    }
    
    next()
  
  } catch (err) {
    res.status(403).json({
      success: false,
      errors: err 
    });
  }
}

export default isAdmin