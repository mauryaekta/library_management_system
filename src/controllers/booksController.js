const db = require('../models')
const { getOne, getPagination, searchQuery, getPagingData } = require('../utils/commonQuery')
const { Op } = require('sequelize');


const addBooks = async (req, res) => {
    try {
        const book = await db.Book.create(req.body)
        if (book) return res.status(201).send({ message: "books Created successFully", book });
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
}
const getAllBook = async (req, res) => {
    const { page, size, title } = req.query;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
    try {
        const { limit, offset } = getPagination(page, size);
        const books = await db.Book.findAndCountAll({ where: condition, limit, offset })
        const response = getPagingData(books, page, limit)
        return res.status(200).send({
            message: 'books get successfully', response
        })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
}
const getOneBook = async (req, res) => {
    try {
        const book = await db.Book.findByPk(req.params.id)
        if (!book) return res.status(200).send({ message: 'Book does not exist into db' })
        return res.status(200).send({ message: 'Book get successFully', book })
    } catch (error) {
        return res.status(400).send({ error: error.message })
    }
}
const searchBook = async (req, res) => {
    try {
        const result = await searchQuery(db.Book, req.query)
        return res.status(200).json({ result });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const updateBook = async (req, res) => {
    try {
        const isBookExist = await getOne(db.Book, { id: req.params.id })
        if (!isBookExist) return res.status(200).send({ message: 'Book Does not exist into DB' })
        const book = await db.Book.update(req.body, { where: { id: req.params.id } })
        return res.status(200).send({ message: 'record Updated successFully', status: book[0] })

    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const deleteBook = async (req, res) => {
    try {
        const isBookExist = await getOne(db.Book, { id: req.params.id })
        if (!isBookExist) return res.status(200).send({ message: 'Book Does not exist into DB' })
        const checkLoanBook = await getOne(db.Loan, { book_id: req.params.id })
        if (checkLoanBook) return res.status(200).send({ message: 'you can not delete book because it is loaned by user' })
        const book = await db.Book.destroy({ where: { id: req.params.id } })
        return res.status(200).send({ message: 'record Delete successFully', status: book[0] })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = {
    addBooks,
    getAllBook,
    getOneBook,
    searchBook,
    updateBook,
    deleteBook,
}