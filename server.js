const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const User=require('./app/models/user.model')
const app = express();
global.__basedir = __dirname;

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
const initRoutes = require("./app/routes")
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const { authJwt } = require("./app/middlewares");
const Role = db.role;

db.mongoose
  .connect("mongodb://localhost:27017/react-image-upload", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.log("zxzxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// app.get("/getuser", authJwt.verifyToken, async (req, res) => {

//   // let token = req.headers["access-token"];
//   // console.log(token);
//   // let decoded = jwt.verify(token, "Saurabh-secret-key");
//   // const id = decoded.id;
//   // console.log(id);
//   // console.log(token);
//   const getuser = await User.find({ _id: { $eq: id } });
//   if (getuser) {
//     res.status(200).json({ getuser });
//   } else {
//     res.status(400).json({ message: "User not Found" });
//   }
//   next();
// });    
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/index")(app);
app.use(express.urlencoded({ extended: true }));
initRoutes(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
