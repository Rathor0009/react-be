const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = async (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  let id;
 console.log(token);
  jwt.verify(token, config.secret, (err, decoded) => {
   console.log(decoded);
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    id = decoded.id;
  
   
  });
  const getuser = await User.find({ _id: { $eq: id } });
  if(getuser){
    res.status(200).json({getuser})
  }else{
    res.status(400).json({message:"User not Found"})
  }
  next()
//  const token =
//    req.body.token || req.query.token || req.headers["x-access-token"];
//  if (!token) {
//    return res
//      .status(403)
//      .json({ message: "A token is required for authentication" });
//  }
//  try {
//    const decoded = jwt.verify(token, config.secret);

//    req.user = decoded;
//  } catch (err) {
//    return res.status(401).json({ message: "Invalid Token" });
//  }
//  return next();
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isModerator
};
module.exports = authJwt;
