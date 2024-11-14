const app = require("./app");

app.listen(app.get("port"),()=> {
    console.log('[ZEROFIF] Server is running at',app.get("port"), 'port!');
});