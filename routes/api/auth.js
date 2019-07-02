import express from 'express'
import passport from 'passport'
import bcrypt from 'bcryptjs'
const LocalStrategy = require('passport-local').Strategy
const router = express.Router()
const User = require('../../models/User')
const auth = require('../../middleware/passportAuth')

// Passport Start
passport.use(
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) done(null, false)
        else {
          const isMatch = await bcrypt.compare(password, user.password)
          if (!isMatch) done(null, false)
          else done(null, user.id)
        }
      } catch (err) {
        return done(err)
      }
    }
  )
)

passport.serializeUser((userId, done) => {
  done(null, userId)
})

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Passport Ends

// @route   GET api/auth
// @desc    Test route
// @access  Private
router.get('/', auth, (req, res) => res.send(req.user))

// @route   POST api/auth
// @desc    Login route
// @access  Public
router.post('/', passport.authenticate('local'), (req, res) => {
  res.send('Authorized')
})

// @route   POST api/auth/logout
// @desc    Logout route
// @access  Public
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) res.status(422).send(err)
    req.logout()
    res.clearCookie('connect.sid').send('Logged out')
  })
})

module.exports = router
