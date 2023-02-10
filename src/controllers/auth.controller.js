const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/usersSchema");
const authenticate = require("../utils/auth");

const router = express.Router();

router.post("/signup", (req, res) => {
  try {
    const { name, email, password, type} = req.body;

    User.findOne({ email }).then((user) => {
      if (user) {
        res.status(400).json({ message: "Email already exists" });
      } else {
        bcrypt.hash(req.body.password, 8, function (err, hash) {
          if (err) return res.json({ error: true });
          else {
            const newUser = new User({
              name,
              email,
              password: hash,
              type,
            });

            newUser.save();
            const token = jwt.sign(
              { id: newUser._id, type: newUser.type},
              "mynameisvivekkumaryadavokdkfidfhdifijhugbyigndfksdn",
              { expiresIn: "1d" }
            );
            // Return the token and user information
            res.json({ token, newUser });
          }
        });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "Invalid email or password" });
    } else {
      let result = bcrypt.compareSync(password, user.password);

      if (result) {
        const token = jwt.sign(
          { id: user._id, type: user.type },
          "mynameisvivekkumaryadavokdkfidfhdifijhugbyigndfksdn",
          {
            expiresIn: "1d",
          }
        );

        res.json({
          message:"Login successful",

          name: user,

          token: token,
        });
      } else {
        res.status(404).json({ message: "Invalid email or password" });
      }
    }
  });
});

router.get("/verify", authenticate, (req, res) => {
  res.json({ message: "Token is valid" });
});

module.exports = router;
