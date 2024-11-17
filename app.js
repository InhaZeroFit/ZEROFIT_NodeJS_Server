const express=require("express");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const path = require("path")
const morgan = require("morgan");
const cookie_parser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig=require('./passport');
const rateLimit = require("express-rate-limit");
const logger = require("./logs/logger");
const hpp = require("hpp");

dotenv.config(); // Load environment variables

const redis_client = require("./config/redis");
const RedisSessionStore = require("connect-redis").default;

const main_router = require("./routes/main");
const auth_router = require("./routes/auth");
const db = require("./models");

const app = express();

passportConfig(); // Setting passport

// Server setting
app.set("port",process.env.PORT || process.env.NODE_PORT);
app.set("view engine", "html");
nunjucks.configure("views", {
    express : app,
    watch : true,
});

// Database setting
db.sequelize.sync({force : false})
    .then(() => {
        console.log("[MySQL] Database & tables connected!");
    })
    .catch((error) => {
        console.log("[MySQL] Error creating database tables:",error);
    })

// Rate Limiting
const globalLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1분
    max: 10, // 1분에 최대 10회 요청
    message: "Too many requests, please try again later.",
});
app.use(globalLimiter);

// Middlewares
if (process.env.NODE_ENV == "production") {
    app.use(morgan("combined"));
    app.use(hpp()); // HTTP parameter contamination prevention
} else {
    app.use(morgan("dev"));
}
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie_parser(process.env.COOKIE_SECRET)); // Set up cookie parser (to store CSRF tokens in cookies)
app.use(express.json()); // JSON and URL encoded request body parsing
app.use(express.urlencoded({extended:false}))
const session_options = {
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true, // Protected from XSS if setted true
        secure : false, // Sent only if the cookie is an HTTPS request if setted true.
        sameSite : "strict", // There are options of strict, lax, none.
        maxAge: 1000 * 60 * 60, // 1 hours
    },
    store : new RedisSessionStore({ client : redis_client }),
}
app.use(session(session_options));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", main_router);
app.use("/auth", auth_router);

// Middlewares for error handing
app.use((req, res, next) => {
    const error = new Error(`Not existed ${req.method} ${req.url} routes.`);
    error.status = 404;
    logger.info(`404 Error: ${req.method} ${req.url} route not found`);
    logger.error(error.message);
    next(error);
});

app.use((err,req,res,next) => {
    res.locals.message=err.message
    res.locals.error=process.env.NODE_ENV !== 'production' ? err : {} // If NODE_ENV isn't production then, print err
    res.status(err.status || 500)
    res.render('error')
});

module.exports = app;