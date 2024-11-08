const express=require("express");

const path = require("path")
const cookie_parser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const nunjucks = require("nunjucks");

dotenv.config();
// const user_router = require("./routes/route_user");
// const clothes_router = require("./routes/route_clothes");
// const market_router = require("./routes/route_market");
// const wardrobe_router = require("./routes/route_wardrobe");
const main_router = require("./routes/route_main");
const db = require("./models");

const app = express();
const PORT = 8005;
app.set("port", process.env.PORT || PORT);
app.set("view engine", "html");
nunjucks.configure("views", {
    express : app,
    watch : true,
});
db.sequelize.sync({force : false})
    .then(() => {
        console.log("[ZEROFIT] Database & tables created!");
    })
    .catch((error) => {
        console.log("[ZEROFIT] Error creating database tables:",error);
    })

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

// app.use("/user", user_router);
// app.use("/clothes", clothes_router);
// app.use("/market", market_router);
// app.use("/wardrobe", wardrobe_router);
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