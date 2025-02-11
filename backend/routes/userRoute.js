const express = require("express");
const User = require("../models/UserModel.js")
const {signJwt, verifyJwt} = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userRouter = express.Router();


//register
userRouter.route('/register').post((req, res) =>{
    User.find({email: req.body.email}).then(function(users, error) {
        if (error || users.length > 0) {
            return res.send({error: "email already exists!"});
        } 
        const salt = 10;
        bcrypt.genSalt(salt, function(error, salt) { 
            bcrypt.hash(req.body.password, salt, function(error, hash) {
                let user = new User({name: req.body.name, surname: req.body.surname, username: req.body.username, email: req.body.email, password: hash, phone: req.body.phone, role: req.body.role});
                user.save();
                //console.log(hash);
                return res.json(user);
            });
          });
    })
})


//login
userRouter.route('/login').post(async (req, res) => {
    console.log(req.body, "user");
    User.find({email: req.body.email}).then(function(users) {
        if (users.length === 0) {
            return res.json({ message: "User doesn't exist" });
        }
        const user = users[0];

        if (req.body.email !== user.email) {
            return res.json({ message: "Email is not correct" });
        }
   
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (result) {
                const token = signJwt(user._id);
                return res.json({
                    accessToken: token,
                    user_id: user.id,
                    user_role: user.role,
                    user_name: user.name
                });
            } 
            else {
                return res.json({ message: "Password is not correct" });
            }
        });
    })
  
});

module.exports = userRouter;
