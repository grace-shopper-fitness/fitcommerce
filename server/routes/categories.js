const router = require('express').Router();
const Category = require('../../db/models/category');

router.get('/', (req, res, next) => {
    Category.findAll()
    .then( categories => res.json(categories) )
    .catch(next);
})




module.exports = router;
