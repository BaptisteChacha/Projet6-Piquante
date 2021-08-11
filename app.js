const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieSession = require('cookie-session');


const User = require('./models/User');

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://Baptiste:lbt480@cluster0.ich6r.mongodb.net/Project6?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use(express.json());

app.use(helmet());
//app.disable('x-powered-by');
//app.disable('ieNoOpen');

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }))

const  apiLimiter  =  rateLimit ( {
    windowMs : 1  *  60  *  1000 ,  // 1 minute
    max : 100, // maximum de 100 requêtes par minutes
    message: "Nombre de requête maximum atteinte, veuillez réessayer dans 1 minute"
  }) ;
  app.use (apiLimiter) ;
  


app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);
app.use('/Images', express.static(path.join(__dirname, 'images')));

module.exports = app;