const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
var SHA256 = require("crypto-js/sha256");
require('dotenv').config();


const passwordvalidator = require('password-validator');
var CryptoJS = require('crypto-js');


exports.signup = (req, res, next) => {
    var emailCrypte = CryptoJS.SHA256(JSON.stringify(req.body.email), process.env.ENCRYPT).toString();
    const passwordValidator = new passwordvalidator();
    passwordValidator
        .is().min(8)
        .is().max(50)
        .has().digits(3)
        .has().not().spaces()
        .has().uppercase();
    if (passwordValidator.validate(req.body.password)) {
        console.log('Votre mot de passe est sécurisé')
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: emailCrypte,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: 'Utilisateur crée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
            .catch(error => res.status(500).json({ error }));
    }
    else {
        res.status(400).json({ message: 'Votre mot de passe n\'est pas assez sécurisé' })
    }

};

exports.login = (req, res, next) => {
    var emailCrypte = CryptoJS.SHA256(JSON.stringify(req.body.email), process.env.ENCRYPT).toString();
    User.findOne({ email: emailCrypte })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.KEY,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

