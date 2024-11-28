const dotenv = require('dotenv');
dotenv.config();

exports.home = async (req, res, next) => {
  try {
    const response = {
      title: 'ZEROFIT - MAIN',
    };
    if (process.env.NODE_ENV == 'development') {
      response['notice'] = 'This is development server';
    }
    res.render('main', response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};