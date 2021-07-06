const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauces');
const multer = require('../middlewares/multer-config');

const auth = require("../middlewares/auth");

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.like);

module.exports = router;