exports.home = async(req, res, next) => {
    try {
        res.render("home", {
            title : "zerofit-home"
        });
    } catch(error) {
        console.log(error);
        next(error);
    }
};