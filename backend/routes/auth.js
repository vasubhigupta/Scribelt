const express = require("express");
const User = require("../model/User");
const { validationResult, body } = require("express-validator");
const router = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "thi$IsaMERNapp";

//router.post(path, [middleware], callback)

//Route 1: Creating a user using POST "/api/auth/createUsers" Doesn't do Auth. No login required
router.post( "/createUser", [
    body("name", "Not a valid name.").isLength({ min: 3 }),
    body("email").isEmail().withMessage("Not a valid e-mail address"),
    body("password").isLength({ min: 5 }).withMessage("Not a valid password"),
  ], async (req, res) => {
    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);  //salt generator
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET); // Ensure JWT_SECRET is defined in your environment variables

      // Send the JWT token as a response
      res.json({ authtoken });
    } catch (err) {
      if (err.code === 11000) {
        // Duplicate key error
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }
      console.error(err.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 2: Authenticate a USER, POST on "/api/auth/login"
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter password").exists(),
  ],
  async (req, res) => {
    //if there are errors return errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //destructuring to remove password and email from the body
    const { email, password } = req.body;
    try {
      //here to find if user exists
      let user = await User.findOne({ email });
      if (!user) { //user doesnt exist
        return res
          .status(400)
          .json({ error: "Enter with correct credentials." });
      }
      //bcrypt.compar(string, hash password) return true false
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "Enter with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

//Route 3: Get User. Send token and get user info from 
router.post('/getUser', fetchuser, async(req,res) =>{
  
  try{
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user); 
  }catch (error){
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router;
