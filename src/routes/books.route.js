const express = require('express')
const router = express.Router()
const { addBooks, getAllBook, getOneBook, updateBook, deleteBook, searchBook } = require('../controllers/booksController')

router.post('/create', addBooks)
router.get('/getAll', getAllBook)
router.get('/getOne/:id', getOneBook)
// router.get('/getDetails/:id', getBookDetails)
router.get('/search', searchBook)
router.put('/update/:id', updateBook)
router.delete('/delete/:id', deleteBook)

module.exports = router