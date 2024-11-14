const express=require("express");

const path = require("path")
const cookie_parser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");
const cors = require("cors");


dotenv.config();

const main_router = require("./routes/main");
const db = require("./models");

const app = express();
const PORT = 8005;

app.set("port", PORT || process.env.PORT);
app.set("view engine", "html");
nunjucks.configure("views", {
    express : app,
    watch : true,
});

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

app.use(cors()); // Allow another ports.

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

// Routes
app.use("/", main_router);

app.use((req, res, next) => {
    const error = new Error(`Not existed ${req.method} ${req.url} routes.`);
    error.status = 404;
    next(error);
})

app.use((err,req,res,next) => {
    res.locals.message=err.message
    res.locals.error=process.env.NODE_ENV !== 'production' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app;