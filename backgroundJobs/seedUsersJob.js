require('dotenv').config();
const fs = require('fs');
const util = require('util');
const path = require('path');
const appendContentToFile = util.promisify(fs.appendFile) 
const neatCsv = require('neat-csv');
// uncomment the below commented lines when using the (commented) code for hashing the passwords.
// const bcrypt = require('bcrypt'); 
// const config = require('../config/config');
const faker = require('faker');
const Queue = require('bull');
const models = require('../models');
const esClient = require('../config/elasticSearchConnection');
const {
    user: User
} = models;


( () => {
    const redisConfig = {port: process.env.REDIS_PORT, host: process.env.REDIS_HOST};
    const queue = new Queue('seed_users', {redis: redisConfig, limiter: {max: 500, duration: 1000}});
    /* 
        These Queued jobs will be processed by the Cluster of Node Processes in the current implementation. 
        NOTE: We could also use Lambda functions to process this queue as a better alternative which is serverless.
        As Lambdas can be triggered and executed in parallel, they will be able to process such a huge queue faster than the Node cluster.
    */
    queue.process('user-data', job => {
        return insertUserToDB(job);
    });
    queue.process('write-user-data', job => {
        return writeUserDataToCSV(job);
    });

    queue.on('completed', function(job, result){
        console.log('===============================');
        console.log('Queue Processing finished...');
        console.log('===============================');
    })

    const writeUserDataToCSV = (job) => {
        console.log('Path to file -> ', path.join(__dirname, '../MOCK_DATA_CYPHERTREE_ASSESSMENT.csv'));
        appendContentToFile(path.join(__dirname, '../MOCK_DATA_CYPHERTREE_ASSESSMENT.csv'), job.data).then( result => {
            return job.moveToCompleted('done', true)
        }).catch(err => {
            console.log('Job Failed -> ', err);
            return job.moveToFailed({message: 'job failed'})
        });
    }

    const insertUserToDB = (job) => {
        const {name, email, company, password, linkedIn_profile, twitter_profile} = job.data;
        User.create({
            name, email, password, company, twitter_profile, linkedIn_profile
        }).then((user) => {
            return job.moveToCompleted('done', true)
        }).catch(err => {
            console.log('Job Failed -> ', err);
            return job.moveToFailed({message: 'job failed'})
        });
        /* 
            NOTE: We can hash the passwords before inserting the user records using the following code.
        */
        // bcrypt.hash(password, config.salt_rounds, (err, hashedPassword) => {
        //     if(err){
        //         console.log('Job Failed -> ', err);
        //         return job.moveToFailed({message: 'job failed'})
        //     }
            // console.log('Creating user. -> ', hashedPassword);
            // User.create({
            //     name, email, password: hashedPassword, company, twitter_profile, linkedIn_profile
            // }).then((user) => {
            //     console.log('A new User has been created -> ', user.name);
            //     return job.moveToCompleted('done', true)
            // }).catch(err => {
            //     console.log('Job Failed -> ', err);
            //     return job.moveToFailed({message: 'job failed'})
            // });
        // }).catch(err => {
        //     console.log('Job Failed -> ', err);
        //     return job.moveToFailed({message: 'job failed'})
        // })
    }

    module.exports = {
        seedUserDataToDB: () => {
            fs.readFile(path.join(__dirname, '../MOCK_DATA_CYPHERTREE_ASSESSMENT_1000.csv'), 'utf8', async (err, data) => {
                if(err){
                    console.log('Error reading file -> ', err);
                }
                const parsedData = await neatCsv(data);
                parsedData.forEach((userObj, index) => {
                    queue.add('user-data', userObj);
                    
                    esClient.index({
                        index: 'users',
                        body: {...userObj, id: index}
                    }).then(response => {
                        return;
                    })
                    .catch(err => {
                         return console.log(err)
                    })
                })
            });
        },
        queueCSVJobs: () => {
            const getNewUserData = () => {
                return `${faker.name.findName()},${faker.internet.email()},${faker.company.companyName()},${faker.internet.password()},${faker.internet.userName()},${faker.internet.userName()}\n`;
            };
    
            for(let i=0; i < 10000; i++){
                queue.add('write-user-data', getNewUserData());
            }
        }
    }
})();