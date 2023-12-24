
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
// Get one Data Based on conditions
const getOne = async (model, condition) => {
    try {
        const data = await model.findOne({
            where: condition
        });
        if (data) return data;
    } catch (error) {
        throw error;
    }
};

// Delete File from images folder any update of delete images
const deleteFile = async (filePath) => {
    const imagePathToDelete = path.join(__dirname, '../../', filePath);
    fs.unlink(imagePathToDelete, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
        } else {
            console.log('File deleted successfully');
        }
    });
};

//prepare search criteria
const buildSearchCriteria = (model, searchParams) => {
    const modelAttributes = Object.keys(model.rawAttributes)
    const whereCondition = {
        [Op.and]: modelAttributes.reduce((accumulator, attribute) => {
            if (searchParams[attribute]) {
                accumulator.push({
                    [attribute]: { [Op.like]: `%${searchParams[attribute]}%` }
                })
            }
            return accumulator
        }, [])
    }
    return whereCondition
}

//common search query for all model
const searchQuery = async (model, query) => {
    try {
        const whereCondition = buildSearchCriteria(model, query)
        const searchResults = await model.findAll({ where: whereCondition });
        return searchResults;
    } catch (error) {
        throw error;
    }
};

// Get All Data Based on Model and condition
const getAll = async (model, condition, includeModels) => {
    try {
        const result = await model.findAll({
            where: condition,
            include: includeModels,
        })
        return result.length > 0 ? result : 'Record Not found'
    } catch (error) {
        throw error
    }
}

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};
//response od Data based on Pagination
const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows: record } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, record, totalPages, currentPage };
};
module.exports = {
    getOne,
    deleteFile,
    getPagination,
    getPagingData,
    searchQuery,
    getAll,
    buildSearchCriteria
}