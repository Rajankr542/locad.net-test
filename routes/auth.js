const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User');

const router = express.Router();

router.post('/create-user', async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const user = new User({ email, password, username });
    await user.save();
    const token = jwt.sign({ 
        userId: user._id,
        exp: (new Date().getTime() + 60 * 60 * 24 * 1000)/1000  //tokenexpries in 24 hours
    }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err) {
    return res.status(422).send({
      status: 0,
      message: err.message,
    });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).send(    {
      status: 0,
      message: 'Must provide email and password'
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send(
    {
      status: 0,
      message: 'Invalid email please check your email'
    }
    );
  }

  try {
    await user.comparePassword(password);
    const token = jwt.sign({ 
        userId: user._id,
        exp: (new Date().getTime() + 60 * 60 * 24 * 1000)/1000  //tokenexpries in 24 hours
    }, 'MY_SECRET_KEY');
    res.send({
      status: 1,
      message: 'Login sucessful',
      response: {
        user: {
          username: `${user.username}`,
          email: `${user.email}`,
        },
        accessToken: `${token}`
      }
    });
  } catch (err) {
    return res.status(422).send(
    {
      status: 0,
      message: 'Invalid password please check your password'
    }
    );
  }
});

module.exports = router;
