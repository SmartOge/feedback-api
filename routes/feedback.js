const express = require('express');
const {validateFeedback} = require('../validator')
const Feedback = require("../models/feedback")
const multer = require("multer");
const login_required = require('../middleware/auth');
const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, "uploads/")
  },
  filename: function(req, file, cb){
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const feedback  = await Feedback.find()
    res.send(feedback)
  }catch (err) {
    res.send("Error while fetching Data")
  }
})


router.post("/", async(req, res) => {
  try{
    const { error } = validateFeedback(req.body)
    if (error) {
      return res.send(error.details[0].message)
    }

    let feedback = new Feedback({
      // user: req.user.id,
      text: req.body.text,
      rating: req.body.rating
    })

    feedback = await feedback.save()
    res.json(feedback)
  }catch(err){
    res.send(err)
  }
})



router.put("/:id", async(req, res)=>{
  try{
    const {error} = validateFeedback(req.body)
    if (error) {
      res.send(error.details[0].message)
    }

    const feedback = await Feedback.findByIdAndUpdate(req.params.id, {
      text: req.body.text,
      rating: req.body.rating
    }, {new: true})

    if (!feedback) {
      res.send("No Feedback Found")
    }

    res.json(feedback)
  }catch(err){
    res.send(err)
  }
})


router.delete('/:id', async (req, res) =>{
try{
const feedback = await Feedback.findByIdAndDelete(req.params.id)
if (!feedback) {
  res.send("No feedback found")
}
res.json(feedback)
}catch (err){
res.send(err)
}
})

module.exports = router

