const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');

    //verify if it's an legal token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //verify if the token is still in the db
    const user = await User.findOne({_id: decoded._id, 'jsonWebTokens.jsonWebToken': token});

    if (!user) {
        throw new Error();
    }
    req.jwToken = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({error: 'The token is illegal.'});
  }
};

module.exports = auth;