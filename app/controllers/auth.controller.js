const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const jwt = require("jsonwebtoken");


var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};

exports.update = async (req, res) => {
  const { username, email, u_id } = req.body;
  console.log(req.body);
  if (!(username && email && u_id)) {
    return res.status(400).json({ message: "All input required" });
  }
  const updateuser = await User.updateOne(
    { _id: { $eq: u_id } },
    {
      $set: {
        username,
        email,
      },
    },
    { new: true }
  );
  if (updateuser.modifiedCount) {
    res.status(200).json({
      message: "Your profile  has updated successfully",
      updateuser,
    });
  } else {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
exports.getuser=async (req,res,next)=>{
  let token = req.headers["access-token"];
    let decoded = jwt.verify(token, config.secret);
    const id = decoded.id;
    console.log(id);
  const getuser =await User.find({ _id: { $eq: id } })
  if(getuser){
    res.status(200).json({getuser})
  }else{
    res.status(400).json({message:"User not Found"})
  }
  next()
}