const express = require("express")
const User = require("../models/Users")
const {validateLogin} = require("../validator")
const bcrypt = require("bcrypt")


const router = express.Router();

router.post("/", async(req, res) => {
  const {error} = validateLogin(req.body)
  if (error) {
    return res.send(error.details[0].message)
  }

  let user = await User.findOne({email: req.body.email})
  if (!user) {
    return res.send("Invalid Email or Password")
  }

  try{
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) {
      return res.send("Invalid Email or Password")
    }

    const token = user.generateAuthToken()
    res.json({token})
  }catch(err) {
    res.send(err)
  }

})

module.exports = router