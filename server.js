import express from 'express'
import session from 'express-session'
import connectDB from './config/db'
import passport from 'passport'
import config from 'config'
import cookieParser from 'cookie-parser'

const app = express()

// Connect to DB
connectDB()

// Middleware
app.use(
  session({
    secret: config.get('sessionSecret'),
    resave: false,
    saveUninitialized: false
  })
)

app.use(cookieParser())
app.use(express.json({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

// Test endpoint
app.get('/', (req, res) => {
  res.send('API running...')
})

// Define Routes
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/profile', require('./routes/api/profile'))
app.use('/api/users', require('./routes/api/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
