const { Op } = require('sequelize');

const logger = require('../logger');
const { Article } = require('../database');

function formatInput({ data, isPublic, name }) {
  const result = {};

  if (data === undefined && isPublic === undefined && name === undefined) {
    return false;
  }

  if (name !== undefined) {
    result.name = name.toString();
  }
  if (data !== undefined) {
    result.data = data.toString();
  }
  if (isPublic !== undefined) {
    result.isPublic = isPublic.toString().toLowerCase() === 'true';
  }

  return result;
}

async function prepareSingleItem(req, res, next) {
  try {
    const item = await Article.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!item) {
      return res.sendStatus(404);
    }

    res.locals.article = item;

    next();
  } catch (err) {
    next(err);
  }
}

async function getArticle(req, res) {
  const { article } = res.locals;

  if (!article.isPublic && article.UserId !== req.user?.id) {
    return res.sendStatus(403);
  }

  return res.status(200).json(article);
}

async function updateArticle(req, res, next) {
  const { article } = res.locals;

  if (!req.user || article.UserId !== req.user.id) {
    return res.sendStatus(403);
  }

  const input = formatInput(req.body);
  if (!input) {
    return res.sendStatus(400);
  }

  try {
    const newArticle = await Article.update(input, {
      where: {
        id: req.params.id,
      },
    }).then(() => Article.findOne({
      where: {
        id: req.params.id,
      },
    }));

    logger.info(`${req.user.name} updated article #${req.params.id}`);

    return res.status(200).json(newArticle);
  } catch (err) {
    next(err);
  }
}

async function deleteArticle(req, res, next) {
  const { article } = res.locals;
  if (!req.user || article.UserId !== req.user.id) {
    return res.sendStatus(403);
  }

  try {
    await Article.destroy({
      where: {
        id: req.params.id,
      },
    });
  } catch (err) {
    next(err);
  }

  logger.info(`${req.user.name} removed article #${req.params.id}`);

  return res.sendStatus(204);
}

async function getAllArticles(req, res, next) {
  try {
    let list;
    if (!req.user) {
      list = await Article.findAll({
        order: [
          ['createdAt', 'DESC'],
        ],
        where: {
          isPublic: true,
        },
      });
    } else {
      list = await Article.findAll({
        order: [
          ['createdAt', 'DESC'],
        ],
        where: {
          [Op.or]: [
            {
              isPublic: true,
            },
            {
              UserId: req.user.id,
            },
          ],
        },
      });
    }

    return res.status(200).json(list);
  } catch (err) {
    next(err);
  }
}

async function addArticle(req, res, next) {
  if (!req.user) {
    return res.sendStatus(401);
  }
  const input = formatInput(req.body);
  if (!input) {
    return res.sendStatus(400);
  }

  try {
    const newArticle = await Article.create({
      ...input,
      UserId: req.user.id,
    });

    logger.info(`${req.user.name} posted article #${newArticle.id}`);

    return res.status(201).json(newArticle);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  prepareSingleItem,
  getArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  addArticle,
};
