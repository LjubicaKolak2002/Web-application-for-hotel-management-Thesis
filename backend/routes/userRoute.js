const express = require("express");
const User = require("../models/UserModel.js");
const { signJwt, verifyJwt } = require("../jwt.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userRouter = express.Router();

//register
userRouter.route("/register").post((req, res) => {
  User.find({ email: req.body.email }).then(function (users, error) {
    if (error || users.length > 0) {
      return res.send({ error: "email already exists!" });
    }
    const salt = 10;
    bcrypt.genSalt(salt, function (error, salt) {
      bcrypt.hash(req.body.password, salt, function (error, hash) {
        let user = new User({
          name: req.body.name,
          surname: req.body.surname,
          username: req.body.username,
          email: req.body.email,
          password: hash,
          phone: req.body.phone,
          role: req.body.role,
          country: req.body.country,
        });
        user.save();
        //console.log(hash);
        return res.json(user);
      });
    });
  });
});

//login
userRouter.route("/login").post(async (req, res) => {
  console.log(req.body, "user");
  User.find({ email: req.body.email }).then(function (users) {
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
          user_name: user.name,
        });
      } else {
        return res.json({ message: "Password is not correct" });
      }
    });
  });
});

//staff list
userRouter.route("/staff-users").get(verifyJwt, async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["receptionist", "maid", "head maid"] },
    });

    if (users.length > 0) {
      res.json(users);
    } else {
      res.status(404).json({ error: "No staff members found." });
    }
  } catch (error) {
    res.status(500).json({ error: "server error", details: error.message });
  }
});

//staff by id
userRouter.route("/staff-details/:staff_id").get(verifyJwt, (req, res) => {
  const valid = mongoose.Types.ObjectId.isValid(req.params.staff_id);
  if (!valid) {
    return res.json({});
  }
  User.findById(req.params.staff_id).then(function (user) {
    return res.json(user);
  });
});

//staff roles
userRouter.get("/staff-user-roles", async (req, res) => {
  try {
    const roles = await User.distinct("role");
    const filteredRoles = roles.filter(
      (role) => role !== "admin" && role !== "user"
    );
    res.json(filteredRoles);
  } catch (error) {
    res.status(500).json({ error: "Error fetching roles" });
  }
});

//edit staff
userRouter.route("/edit-staff/:staff_id").put(verifyJwt, (req, res) => {
  try {
    User.findOneAndUpdate({ _id: req.params.staff_id }, req.body, {
      new: true,
    }).then(function (updatedStaff) {
      if (!updatedStaff) {
        return res.json({ error: "Can't find this staff user" });
      }
      return res.json(updatedStaff);
    });
  } catch (error) {
    return res.json({ error: "Can't update this staff user" });
  }
});

//delete staff
userRouter.route("/delete-staff/:staff_id").delete(verifyJwt, (req, res) => {
  try {
    User.findByIdAndDelete(req.params.staff_id).then(function (deletedStaff) {
      if (deletedStaff) {
        return res.json({ deletedStaff: "deleted" });
      }
      return res.json({ error: "Staff user not found" });
    });
  } catch (error) {
    return res.json({ error: "error while deleting staff user" });
  }
});

//user by id
userRouter.route("/user/:user_id").get(verifyJwt, (req, res) => {
  const valid = mongoose.Types.ObjectId.isValid(req.params.user_id);
  if (!valid) {
    return res.json({});
  }
  User.findById(req.params.user_id).then(function (user) {
    return res.json(user);
  });
});

//get all maids
userRouter.route("/maids").get(verifyJwt, async (req, res) => {
  try {
    const maids = await User.find({ role: "maid" });
    res.json(maids);
  } catch (error) {
    console.error("Error fetching maids:", error);
    res.status(500).json({ error: "Error fetching maids" });
  }
});

module.exports = userRouter;
