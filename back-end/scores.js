const { json } = require("body-parser")
const express = require("express")
const mongoose = require('mongoose')

const router = express.Router()

const userSchema = new mongoose.Schema({
  username: String,
  submissions: Number,
  created: {
    type: Date,
    default: Date.now
  }
})

const scoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  score: Number,
  created: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)
const Score = mongoose.model('Score', scoreSchema)

/* API Endpoints */

// submit a score
router.post('/', async (req, res) => {
  if (!req.body.username || !req.body.score)
    return res.status(400).send({
      message: "username and score are required"
    })

  try {
    // check for existing user, increment submissions if found
    const existingUser = await User.findOne({
      username: req.body.username
    });
    if (existingUser) {
      existingUser.submissions++
      await existingUser.save()
      const score = new Score({
        user: existingUser._id,
        score: req.body.score
      })
      await score.save()
      return res.send({
        user: existingUser,
        score: score
      })
    }

    // create a new user and save it to the database
    const user = new User({
      username: req.body.username,
      submissions: 1
    })
    await user.save()
    const score = new Score({
      user: user._id,
      score: req.body.score
    })
    await score.save()
    return res.send({
      user: user,
      score: score
    })
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

// get leaderboard of all scores
router.get('/', async (req, res) => {
  try {
    let scores = await Score.find().sort({
      score: -1
    }).populate('user')
    return res.send(scores)
  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
  }
})

module.exports = {
  routes: router,
  model: User,
  model: Score
}