exports.main = async(req, res, next) => {
    try {
        res.render("main", {
            title : "zerofit-main"
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
}