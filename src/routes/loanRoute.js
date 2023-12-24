const express = require('express')
const router = express.Router()
const { getAllRecord, getById, updateloan, deleteLoan, add, getOverdueLoans, checkedLoans, search } = require('../controllers/loanController')

router.post('/create', add)
router.get('/getAll', getAllRecord)
router.get("/overdue_loans", getOverdueLoans)
router.get('/checked_loans', checkedLoans)
router.get('/search', search)
router.get('/getOne', getById)
router.put('/update/:id', updateloan)
router.delete('/delete/:id', deleteLoan)

module.exports = router