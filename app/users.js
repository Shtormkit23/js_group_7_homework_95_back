const router = require("express").Router();
const User = require("../models/User");
const axios = require("axios");
const {nanoid} = require("nanoid");
const config = require("../config");

router.delete("/sessions", async (req, res) => {
    const token = req.get("Authorization");
    const success = {message: "Success"};

    if (!token) return res.send(success);
    const user = await User.findOne({token});

    if(!user) return res.send(success);

    user.generateToken();
    user.save({validateBeforeSave: false});

    return res.send(success);
});

router.post("/facebookLogin", async (req, res) => {
    const inputToken = req.body.accessToken;
    const accessToken = config.fb.appId + "|" + config.fb.appSecret;
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;
    try {
        const response = await axios.get(debugTokenUrl);
        if (response.data.data.error) {
            return res.status(401).send({message: "Facebook token incorrect"});
        }
        if (req.body.id !== response.data.data.user_id) {
            return res.status(401).send({message: "Wrong user ID"});
        }

        let user = await User.findOne({facebookId: req.body.id});
        if (!user) {
            user = new User({
                username: req.body.email,
                password: nanoid(),
                email: req.body.email,
                facebookId: req.body.id,
                displayName: req.body.name,
                facebookImage: req.body.picture.data.url
            });
        }
        user.generateToken();
        await user.save({validateBeforeSave: false});
        res.send(user);
    } catch(e) {
        return res.status(401).send({message: "Facebook token incorrect"});
    }
});

module.exports = router;