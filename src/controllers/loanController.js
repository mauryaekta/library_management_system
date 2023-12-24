const moment = require('moment');
const db = require('../models')
const { getAll, getOne, buildSearchCriteria } = require('../utils/commonQuery');
const { Op } = require('sequelize');

const add = async (req, res) => {
    var currentDate = moment()
    const author_on = req.body.author_on ? req.body.author_on : currentDate.format('YYYY-MM-DD')
    const return_by = req.body.return_by ? req.body.return_by : currentDate.add(7, "days").format('YYYY-MM-DD')
    try {
        const bookIssueRecord = await db.Loan.create({ author_on, return_by, ...req.body, })
        if (bookIssueRecord) {
            await db.User.update({ library_id: bookIssueRecord.id }, { where: { id: bookIssueRecord.user_id } })
        }
        return res.status(201).send({ message: 'record Added SuccessFully', bookIssueRecord })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getById = async (req, res) => {
    try {
        const bookIssueRecord = await getOne(db.Loan, { id: req.params.id })
        return res.status(200).send({ message: "Fetch Record SuccessFully", bookIssueRecord })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const getAllRecord = async (req, res) => {
    try {
        const bookIssueRecord = await getAll(db.Loan, {}, [
            { model: db.Book },
            { model: db.User },
        ])
        return res.status(200).send({ bookIssueRecord })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}
const getOverdueLoans = async (req, res) => {
    try {
        const result = await getAll(db.Loan, {
            returned_on: null,
            return_by: {
                [Op.lt]: new Date()
            },
        }, [
            { model: db.Book },
            { model: db.User },
        ])
        return res.status(200).send({ result })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const checkedLoans = async (req, res) => {
    try {
        const result = await getAll(db.Loan, {
            returned_on: null
        }, [
            { model: db.Book },
            { model: db.User },
        ])
        return res.status(200).send({ result })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const search = async (req, res) => {
    console.log(req.query);
    try {
        const record = await db.Loan.findAll({
            where: buildSearchCriteria(db.Loan, req.query),
            attributes: ['author_on', 'return_by', 'returned_on'],
            include: [
                {
                    model: db.Book,
                    required: false,
                    where: buildSearchCriteria(db.Book, req.query),
                    attributes: ['title', 'author', 'genre']
                },
                {
                    model: db.User,
                    required: false,
                    where: buildSearchCriteria(db.User, req.query),
                    attributes: ['first_name', 'email', 'library_id']
                }
            ]
        });
        const result = record.filter(item => item.book !== null && item.user !== null);
        return res.status(200).send({ result });
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
}

const updateloan = async (req, res) => {
    try {
        const isRecordExist = await getOne(db.User, { id: req.params.id })
        if (!isRecordExist) return res.status(404).send({ message: 'record does not exists' })
        const bookIssueRecord = await db.Loan.update(req.body, { where: { id: req.params.id } });
        return res.status(200).send({ message: 'Record Updated SuccessFully', status: bookIssueRecord[0] })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const deleteLoan = async (req, res) => {
    try {
        const isRecordExist = await getOne(db.Loan, { id: req.params.id })
        if (!isRecordExist) return res.status(404).send({ message: 'record does not exists' })
        const bookIssueRecord = await db.Loan.destroy({ where: { id: req.params.id } })
        return res.status(200).send({ message: 'record Deleted successFully', status: bookIssueRecord[0] })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}


module.exports = {
    add,
    getAllRecord,
    getById,
    getOverdueLoans,
    checkedLoans,
    updateloan,
    deleteLoan,
    search
}
