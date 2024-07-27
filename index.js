const express = require("express");
require("dotenv").config();
const router = require("./routes/client/index.router");
const routerAdmin = require("./routes/admin/index.router");
const database = require("./config/database");
const systemConfig = require("./config/system");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));
app.set("views", `${__dirname}/views`); 
app.set("view engine", "pug");
app.use(bodyParser.urlencoded({ extended: false }));

// flash
app.use(cookieParser("KJJSLKASASASA"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash

//App Locals Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static("public"));
app.use(express.static(`${__dirname}/public`));

router(app);
routerAdmin(app);

app.listen(port, () => {
  console.log(`App listen on port ${port}`);
});
