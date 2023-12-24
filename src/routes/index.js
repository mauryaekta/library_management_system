const express = require('express')
const router = express.Router()
const usersRoute = require('../routes/users.routes')
const booksRoute = require('../routes/books.route')
const loanRoutes = require('./loanRoute')
router.use('/user', usersRoute)
router.use('/book', booksRoute)
router.use('/loan', loanRoutes)
module.exports = router