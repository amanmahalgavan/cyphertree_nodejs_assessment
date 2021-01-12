const sequelize = require('sequelize');
const backgroundJobs = require('../../../backgroundJobs/seedUsersJob');
const models = require('../../../models');
const esClient = require('../../../config/elasticSearchConnection');

const {
    user: User
} = models;

require('sequelize-values')(sequelize);

const callbacks = {
    fetchUsers: (req, res) => {
        User.findAll().then(users => {
            return res.status(200).json(users);
        }).catch(err => {
            return res.status(500).json(err);
        })
    },
    searchUser: (req, res) => {
        const {name} = req.query;
        esClient.search({
            index: "users",
            body: {
                query: {
                    match: {
                        name: name.trim()
                    }
                }
            }
        }).then(response => {
            return res.status(200).json(response);
        })
        .catch(err => {
            return res.status(500).json({message: "Error Searching the user.", err})
        })
    },
    updateUser: (req, res) => {
        const {id, updateObj} = req.body;
        if(updateObj.email) delete updateObj.email;
        User.findOne({ where: { id } }).then(user => {
            user.update(updateObj).then( updatedUser => {
                return res.status(200).json(updatedUser);
            }).catch(err => {
                return res.status(404).json({message: "Unable to update the user. Please try again later."});
            })
        }).catch(err => {
            return res.status(404).json({message: "User not found."});
        })
    },
    deleteUser: (req, res) => {
        const {id} = req.query;
        User.destroy({where: {
            id
        }}).then( result => {
            return res.status(200).json({message: "User removed successfully."});
        }).catch(err => {
            return res.status(500).json(err);
        })
    },
    seedUsers: (req, res) => {
        backgroundJobs.seedUserDataToDB();
        return res.status(200).json('Tasks Queued');
    }
}

module.exports = callbacks;