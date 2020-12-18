const express = require("express");
const cocktails = require("./app/cocktails");
const users = require("./app/users");
const moderation = require("./app/moderation");
const config = require("./config");

const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const port = process.env.NODE_ENV === "test" ? 8010 : 8000;


app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true, autoIndex: true});

    app.use("/cocktails", cocktails);
    app.use("/users", users);
    app.use("/moderation", moderation);

    console.log("Connected to mongoDB");

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`);
    });
};

run().catch(console.log);
