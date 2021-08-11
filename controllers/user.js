const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
var SHA256 = require("crypto-js/sha256");
require('dotenv').config();


const passwordvalidator = require('password-validator');
var CryptoJS = require('crypto-js');


exports.signup = (req, res, next) => {
    // var emailCrypteSave = CryptoJS.AES.encrypt(JSON.stringify(req.body.email), 'secret key 123').toString();
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
        res.status(400).json({ message: 'Votre mot de passe n\'est pas assez sécurisé'})
    }
   
};

exports.login = (req, res, next) => {
    var emailCrypte = CryptoJS.SHA256(JSON.stringify(req.body.email), 'secret key 123').toString();
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
                            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2MjUzMTg5ODEsImV4cCI6MTY1Njg1NDk4MSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.C-Kdb7CexZD1JV6Hx7DRf_sLO-KA3v5IyaC0nwBkv3Q',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

