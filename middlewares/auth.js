const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1].toString();
        const decodedToken = jwt.verify(token, process.env.KEY);
        const userID = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userID) {
            throw 'User ID non valable';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requête non authentifiée !' });
    }
};

