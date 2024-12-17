/*
 * This is file of the project ZEROFIT_NODEJS_SERVER
 * Licensed under the MIT License.
 * Copyright (c) 2024 ZEROFIT_NODEJS_SERVER
 * For full license text, see the LICENSE file in the root directory or at
 * https://opensource.org/license/mit
 * Author: logicallaw
 * Latest Updated Date: 2024-12-18
 */

// 1. Import modules
const express = require('express');
const dotenv = require('dotenv');
const nunjucks = require('nunjucks');
const path = require('path');
const morgan = require('morgan');
const cookie_parser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const ratelimit = require('express-rate-limit');
const logger = require('./logs/logger');
const hpp = require('hpp');
const cors = require('cors');

// customed modules
const passport_config = require('./passport');
const redis_client = require('./config/redis');
const RedisSessionStore = require('connect-redis').default;
const main_router = require('./routes/main');
const auth_router = require('./routes/auth');
const clothes_router = require('./routes/clothes');
const market_router = require('./routes/market');
const wishlist_router = require('./routes/wishlist');
const db = require('./models');

// 2. Set environmental variables
dotenv.config();

// 3. Initialize application
const app = express();
app.set('port', process.env.PORT);
app.set('view engine', 'html');
nunjucks.configure('views', {
  express: app,
  watch: true,
});

// 4. Set security and performance (Rate limit, CORS)
const global_limiter = ratelimit({
  windowMs: 1 * 60 * 1000,  // 1m
  max: 60,                  // 60 times a minute
  message: 'Too many requests, please try again later.',
});
app.use(global_limiter);
app.use(cors());

// 5. Set middlewares
if (process.env.NODE_ENV == 'production') {
  app.use(morgan('combined'));  // Production logging
  app.use(hpp());               // Prevent HTTP parameter pollution
} else {
  app.use(morgan('dev'));  // Development logging
}
app.use(express.static(path.join(__dirname, 'public')));  // Static file serving
app.use(cookie_parser(process.env.COOKIE_SECRET));  // Cookie parser with secret
app.use(express.json(
    {limit: '10mb'}));  // JSON body parsing, JSON request size limit increased
app.use(express.urlencoded({
  limit: '10mb',
  extended: false
}));  // URL-encoded body parsing, URL-encoded request size limit increased

// Set session
const session_options = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'strict',      // CSRF Protection
    maxAge: 1000 * 60 * 60,  // 1 hours
  },
  store: new RedisSessionStore({client: redis_client}),
};
app.use(session(session_options));

// 6. Set Passport
passport_config();
app.use(passport.initialize());
app.use(passport.session());

// 7. Initialize data bases
db.sequelize.sync({force: false})
    .then(() => {
      const host =
          process.env[`SEQUELIZE_${process.env.NODE_ENV.toUpperCase()}_HOST`];
      console.log(`[MySQL at ${host}, ${
          process.env.NODE_ENV}] Database & tables connected!`);
    })
    .catch((error) => {
      const host =
          process.env[`SEQUELIZE_${process.env.NODE_ENV.toUpperCase()}_HOST`];
      console.error(
          `[MySQL at ${host}] Error creating database tables:`, error);
    });

// 8. Set routers
app.use('/', main_router);
app.use('/auth', auth_router);
app.use('/clothes', clothes_router);
app.use('/market', market_router);
app.use('/wishlist', wishlist_router);

// 9. Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error(`Not existed ${req.method} ${req.url} routes.`);
  error.status = 404;
  logger.info(`404 Error: ${req.method} ${req.url} route not found`);
  logger.error(error.message);
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ?
      err :
      {};  // Detailed errors can only be found in a development environment
  res.status(err.status || 500);
  res.render('error');
});

// 10. Export module
module.exports = app;