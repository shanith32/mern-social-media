import express from 'express'
const router = express.Router()
const auth = require('../../middleware/passportAuth')
import { check, validationResult } from 'express-validator/check'

const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )
    if (!profile)
      res.status(400).json({ msg: 'There is no profile for this user' })
    else res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(400).send('Server Error')
  }
})

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills are required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) res.status(400).json({ errors: errors.array() })

    const profileFields = req.body
    profileFields.user = req.user.id

    try {
      const profile = new Profile(profileFields)
      await profile.save()
    } catch (err) {
      console.error(err.message)
    }
  }
)

module.exports = router
