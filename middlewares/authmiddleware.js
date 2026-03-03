import jwt from "jsonwebtoken";

const authmiddlewares = async(req, res, next) => {
    // console.log("Headers:",req.headers)
    
  try {
    console.log("middleware running")

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // console.log("Decoded:", decoded); // debugging


    

    req.user = { id: decoded.id };

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

export default authmiddlewares;
