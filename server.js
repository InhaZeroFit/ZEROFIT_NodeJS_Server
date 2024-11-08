const app = require("./app");

app.listen(app.get("port"),()=> {
    console.log('[ZEROFIF] Waiting at port ',app.get("port"), '...');
});