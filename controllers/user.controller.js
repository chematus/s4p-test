const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');

const logger = require('../logger');
const { User, Article } = require('../database');

function prepareToken({ name, username, id }) {
  const expiresIn = process.env.JWT_EXPIRE || 3600000; // ms
  const token = jwt.sign(
    {
      name,
      username,
      id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
    },
  );

  return {
    access_token: token,
    type: 'Bearer',
    expiresIn,
  };
}

function passwordToHash(password) {
  return crypto
    .pbkdf2Sync(password, process.env.SALT, 1000, 64, 'sha512')
    .toString('hex');
}

async function loginUser(req, res, next) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Both username and password are required');
  }

  try {
    const hash = passwordToHash(password);

    const user = await User.findOne({
      where: {
        username,
        password: hash,
      },
    });

    if (!user) {
      return res.status(400).send('Invalid credentials');
    }

    const token = prepareToken(user);

    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
}

async function registerUser(req, res, next) {
  const {
    name, email, username, password,
  } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(400).send('Missing required input');
  }

  const user = await User.findOne({
    where: {
      [Op.or]: [
        {
          email,
        },
        {
          username,
        },
      ],
    },
  });

  if (user) {
    return res.status(422).send('User already exists');
  }

  try {
    const newUser = await User.create({
      name,
      email,
      username,
      password: passwordToHash(password),
    });

    const token = prepareToken(newUser);
    logger.info(`${username} signed up`);

    return res.status(201).json({
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserProfile(req, res, next) {
  try {
    const user = await User.findOne({
      attributes: ['name', 'createdAt'],
      where: {
        id: +req.params.id,
      },
      include: {
        model: Article,
        where: {
          isPublic: true,
        },
        order: [
          ['createdAt', 'DESC'],
        ],
        limit: 10,
        required: false,
      },
    });

    if (!user) {
      return res.sendStatus(404);
    }

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

async function getPersonalProfile(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: req.user.id,
      },
      include: {
        model: Article,
        order: [
          ['createdAt', 'DESC'],
        ],
        limit: 10,
        required: false,
      },
    });

    if (!user) {
      return res.sendStatus(404);
    }

    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

async function updatePersonalProfile(req, res, next) {
  if (!req.user) {
    return res.sendStatus(403);
  }

  const {
    name, username, email, password,
  } = req.body;

  if (email || username) {
    const sparams = [];

    if (email) {
      sparams.push({ email });
    }

    if (username) {
      sparams.push({ username });
    }
    const user = await User.findOne({
      where: {
        [Op.or]: sparams,
      },
    });

    if (user) {
      return res.status(422).send('Data is not unique');
    }
  }

  let hash;
  if (password) {
    hash = passwordToHash(password);
  }

  try {
    const updatedUser = await User.update(
      {
        name,
        username,
        email,
        password: hash,
      },
      {
        where: {
          id: req.user.id,
        },
      },
    ).then(() => User.findOne({
      attributes: {
        exclude: ['password'],
      },
      where: {
        id: req.user.id,
      },
    }));

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  loginUser,
  registerUser,
  getUserProfile,
  getPersonalProfile,
  updatePersonalProfile,
};
