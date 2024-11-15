const express=require("express");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const path = require("path")
const morgan = require("morgan");
const cookie_parser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const passport = require("passport");
const passportConfig=require('./passport');

dotenv.config();

const main_router = require("./routes/main");
const auth_router = require("./routes/auth");
const db = require("./models");

const app = express();
const PORT = 8005;

passportConfig(); // Setting passport

// Server setting
app.set("port", PORT || process.env.PORT);
app.set("view engine", "html");
nunjucks.configure("views", {
    express : app,
    watch : true,
});

// Database setting
db.sequelize.sync({force : false})
    .then(() => {
        console.log("[ZEROFIT] Database & tables setted!");
    })
    .catch((error) => {
        console.log("[ZEROFIT] Error creating database tables:",error);
    })

// Middlewares
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookie_parser(process.env.COOKIE_SECRET));
app.use(session({
    resave : false,
    saveUninitialized : false,
    secret : process.env.COOKIE_SECRET,
    cookie : {
        httpOnly : true,
        secure : false,
    }
}));
app.use(cors()); // Allow another ports.
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", main_router);
app.use("/auth", auth_router);

// Middlewares for error handing
app.use((req, res, next) => {
    const error = new Error(`Not existed ${req.method} ${req.url} routes.`);
    error.status = 404;
    next(error);
});

app.use((err,req,res,next) => {
    res.locals.message=err.message
    res.locals.error=process.env.NODE_ENV !== 'production' ? err : {} // If NODE_ENV isn't production then, print err
    res.status(err.status || 500)
    res.render('error')
});

module.exports = app;