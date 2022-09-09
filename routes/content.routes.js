const express = require('express');

const contentController = require('../controllers/content.controller');

const router = express.Router();

router.route('/content/:id([0-9]+)').all(contentController.prepareSingleItem);
router.route('/content/:id([0-9]+)').get(contentController.getArticle);
router.route('/content/:id([0-9]+)').put(contentController.updateArticle);
router.route('/content/:id([0-9]+)').delete(contentController.deleteArticle);
router.route('/content').get(contentController.getAllArticles);
router.route('/content').post(contentController.addArticle);

module.exports = router;
