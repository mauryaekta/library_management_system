const db = require('../models')
const { getOne, deleteFile, getPagination, getPagingData, getAll, searchQuery } = require('../utils/commonQuery');
const sendMail = require('../utils/sendMail');

const createUser = async (req, res) => {
    const { email } = req.body;
    try {
        const isUserExist = await getOne(db.User, { email })
        if (isUserExist) return res.status(200).send({ message: 'user already exist' })
        let profileImgPath = req.file ? req.file.path : null;
        const userData = await db.User.create({ ...req.body, profileImg: profileImgPath })
        await sendMail(userData)
        if (userData) return res.status(201).send({ message: "user Created successFully", userData });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const getAllUser = async (req, res) => {
    const { page, size } = req.query;
    try {
        const { limit, offset } = getPagination(page, size);
        const userData = await db.User.findAndCountAll({ limit, offset })
        const response = getPagingData(userData, page, limit)
        return res.status(200).send({
            message: 'books get successfully', response
        })
    } catch (error) {
        return res.status(500).error({ error: error.message })
    }
}

// get user Details
const getOneUser = async (req, res) => {
    try {
        const userData = await db.User.findByPk(req.params.id)
        if (!userData) return res.status(404).send({ message: "User Does Not Exist into Database" })
        return res.status(200).send({ message: 'User Get SuccessFully', userData })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
// get individual user and other details
const getUserDetails = async (req, res) => {
    try {
        const userData = await getAll(db.User, {}, [{ model: db.Loan }, { model: db.Book }])
        return res.status(200).send({ message: 'Record Retrieved Successfully', userData })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const searchUser = async (req, res) => {
    try {
        const result = await searchQuery(db.User, req.query)
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const isUserExist = await getOne(db.User, { id: req.params.id })
        if (!isUserExist) return res.status(404).send({ message: 'User Does not exist into DB with given id' })
        const isEmailExist = await getOne(db.User, { email: req.body.email })
        if (isEmailExist) return res.status(200).send({ message: 'Email already exist' })
        if (req.file && isUserExist.profileImg) {
            await deleteFile(isUserExist.profileImg)
        }
        let profileImgPath = req.file ? req.file.path : isUserExist.profileImg;
        const updateValue = { ...req.body, profileImg: profileImgPath }
        const userData = await db.User.update(updateValue, { where: { id: req.params.id } })
        return res.status(200).send({ message: 'user Updated successfully', status: userData[0] })
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

const deleteUser = async (req, res) => {
    try {
        const isUserExist = await getOne(db.User, { id: req.params.id })
        if (!isUserExist) return res.status(404).send({ message: 'User Does not exist into DB with given id' })
        const existingImagePath = isUserExist.profileImg;
        const userData = await Users.destroy({ where: { id: req.params.id } })
        if (existingImagePath) {
            deleteFile(existingImagePath)
        }
        return res.status(200).send({ message: 'user Deleted SuccessFully', status: userData[0] })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    createUser,
    getAllUser,
    getOneUser,
    getUserDetails,
    searchUser,
    updateUser,
    deleteUser,
}