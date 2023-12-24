const express = require('express')
const router = express.Router()
const { createUser, getAllUser, getOneUser, updateUser, deleteUser, getUserDetails, searchUser } = require('../controllers/usersController')
const upload = require('../middleware/imageMiddleware')

router.post('/create', upload.single('profileImg'), createUser)
router.get('/getAll', getAllUser)
router.get('/getOne/:id', getOneUser)
router.get('/getDetails', getUserDetails)
router.get('/search', searchUser)
router.put('/update/:id', upload.single('profileImg'), updateUser)
router.delete('/delete/:id', deleteUser)

module.exports = router;