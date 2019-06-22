import express from 'express'
import passport from 'passport'
import bcrypt from 'bcryptjs'
const LocalStrategy = require('passport-local').Strategy
const router = express.Router()
const User = require('../../models/User')

// Passport Start
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) done(null, false)

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) done(err)
          if (!isMatch) done(null, false)
          else done(null, user)
        })
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.status(401).send('You are not Authenticated!')
  }
}
// Passport Ends

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', ensureAuthenticated, (req, res) => res.send('Auth route'))

// @route   POST api/auth/login
// @desc    Login route
// @access  Public
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.send(req.user)
})

module.exports = router
