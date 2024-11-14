exports.home = async(req, res, next) => {
    try {
        res.render("main", {
            title : "ZEROFIT - MAIN"
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
};