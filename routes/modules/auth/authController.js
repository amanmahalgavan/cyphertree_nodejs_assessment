const sequelize = require('sequelize');
const fs = require('fs');
const util = require('util');
const appendContentToFile = util.promisify(fs.appendFile) 
const path = require('path');
const neatCsv = require('neat-csv');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../../../config/config');
const models = require('../../../models');

const faker = require('faker');
const Queue = require('bull');
const redisConfig = {port: 6379, host: '127.0.0.1'};
const queue = new Queue('seed_users', {redis: redisConfig, limiter: {max: 500, duration: 1000}});


const {
    user: User
} = models;

require('sequelize-values')(sequelize);

const callbacks = {
    signup: ({body}, res) => {
        const {name, email, password, company, twitter_profile, linkedIn_profile} = body;
        if (!name || !email || !password) {
            return res.status(400).json({message: 'Please provide name, email & password'});
        }
        bcrypt.hash(password, config.salt_rounds, (err, hash) => {
            if (err) {
                return res.status(500).json({message: 'Please try again'});
            }
        
        
            User.create({
                name, email,  password: hash, company, twitter_profile, linkedIn_profile
            }).then((user) => {
                return res.status(200).json({message: 'A new User has been created.', user});
            });
        });
    },
    signin: (req, res) => {
        const {email, password} = req.body;
        User.findOne({
            where: {
                email
            }
        })
        .then(user => {
            if (!user) {
            return res.status(404).send({ message: "User Not found." });
            }
            
            const {id: UserId, name, email,  password: UserPassword, company, twitter_profile, linkedIn_profile} = user;

            bcrypt.compare(password, UserPassword).then((validPassword) => {
                if (!validPassword) {
                    return res.status(401).json({authToken: null, message: "Invalid Password!"});
                }
                const token = JWT.sign({ UserId }, config.auth_secret_key, {
                    expiresIn: 86400 // 24 hours
                });
                
                return res.status(200).json({
                    UserId,
                    name,
                    email,
                    company,
                    authToken: token,
                    twitter_profile, 
                    linkedIn_profile
                });

            }).catch((err) => {

            })
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
    }
};

module.exports = callbacks;