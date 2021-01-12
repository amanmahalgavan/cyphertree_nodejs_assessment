const JWT = require('jsonwebtoken');
const config = require('../config/config');
const models = require('../models');
const {user: User} = models;



const validateToken = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization || !authorization.includes('Bearer')){
        return res.status(401).json({message: 'Invalid or Malformed Bearer Authorization Header.'});
    }
    console.log('authorization header --> ', authorization);
    JWT.verify(authorization.split(' ')[1], config.auth_secret_key, (err, decodedToken) => {
        if (err){
            return res.status(401).json({ message: "Unauthorized!" });
        }
        console.log("Token Decoded -> ", decodedToken);
        const {UserId} = decodedToken;
        User.findOne({
            raw: true,
            attributes:{
                exclude: ['password']
            },
            where: {
                id: UserId
            },
        })
        .then((user) => {
            req.user = user;
            next();
        }).catch(err => {
            return res.status(500).json({ message: err });
        })
        
    })
}


const authJwt = {
  validateToken: validateToken
};
module.exports = authJwt;