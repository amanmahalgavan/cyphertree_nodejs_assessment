const express = require('express');
const router = new express.Router();
const Controller = require('./userController');
const {authJwt} = require('../../../middlewares');

router.get('/fetch', authJwt.validateToken, Controller.fetchUsers);
router.put('/update', authJwt.validateToken, Controller.updateUser);
router.delete('/delete', authJwt.validateToken, Controller.deleteUser);
router.get('/seed', Controller.seedUsers);
router.get('/search', Controller.searchUser);

/* 
    Another way of creating routes using the same route-name for all the http verbs

    router.route('/')
        .post( (req, res) => {

        })
        .get( (req, res) => {

        })
        .put( (req, res) => {

        })
        .delete( (req, res) => {

        }) 
*/

module.exports = router;
