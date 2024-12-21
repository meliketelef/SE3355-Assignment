const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { categories: ['Car', 'Villa', 'Bicycle', 'Telephone', 'Land'] });
});

module.exports = router;
