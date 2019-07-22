import express from 'express'
import request from 'request'
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
    else {
      const profileFields = req.body
      profileFields.user = req.user.id

      try {
        const profile = new Profile(profileFields)
        await profile.save()
      } catch (err) {
        console.error(err.message)
      }
    }
  }
)

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get all profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar'])
    if (!profile) res.status(400).send({ msg: 'Profile not found' })
    res.json(profile)
  } catch (err) {
    console.error(err)
    if ((err.kind = 'ObjectId'))
      res.status(400).send({ msg: 'Profile not found' })
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/user/:user_id
// @desc    Get all profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar'])
    if (!profile) res.status(400).send({ msg: 'Profile not found' })
    res.json(profile)
  } catch (err) {
    console.error(err)
    if ((err.kind = 'ObjectId'))
      res.status(400).send({ msg: 'Profile not found' })
    res.status(500).send('Server Error')
  }
})

// @route   DELETE api/profile
// @desc    Delete profile, user and posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user.id })
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// @route   POST api/profile/experience
// @desc    Add experience
// @access  Private
router.post('/experience', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.experience.unshift(req.body)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// @route   DELETE api/profile/experience/:exp_id
// @desc    Remove experience
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// @route   GET api/profile/github/:username
// @desc    Get user repositories from Github
// @access  Public
router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)
      if (response.statusCode != 200)
        return res.status(404).json({ msg: 'No Github profile found' })

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err)
    res.status(500).send('Server Error')
  }
})

// TODO

// @route   POST api/profile/education
// @desc    Add education
// @access  Private

// @route   DELETE api/profile/education/:edu_id
// @desc    Remove education
// @access  Private

module.exports = router
