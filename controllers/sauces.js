const Sauce = require('../models/Sauces');
const fs = require('fs');


exports.createSauce = (req, res, next) => {

  //console.log(JSON.parse(req.body.sauce))
  const sauceObject = JSON.parse(req.body.sauce);
  //console.log(sauceObject)
  delete sauceObject._id
  // console.log(sauceObject)
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));

};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
  // console.log(sauceObject)
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`Images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'objet supprimé' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.body.like == 1) {
        if (!sauce.usersLiked.includes(req.body.userId)) {
          sauce.usersLiked.push(req.body.userId)
          sauce.likes = sauce.likes + 1
        }
      } else if (req.body.like == -1) {
        if (!sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersDisliked.push(req.body.userId)
          sauce.dislikes = sauce.dislikes + 1
        }
      } else if (req.body.like == 0) {
        if (sauce.usersDisliked.includes(req.body.userId)) {
          sauce.usersDisliked.splice(0, 1)
          sauce.dislikes = sauce.dislikes - 1
      }
      else if (sauce.usersLiked.includes(req.body.userId)) {
        sauce.usersLiked.splice(0, 1)
        sauce.likes = sauce.likes - 1
    }}
      //  console.log(sauce)
      sauce.save()
        .then(() => res.status(201).json({ message: 'Avis enregistré !' }))
        .catch(error => res.status(400).json({ error }));
    })
}