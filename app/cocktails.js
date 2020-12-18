const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {nanoid} = require("nanoid");
const config = require("../config");
const auth = require("../middleware/auth");
const Cocktail = require("../models/Cocktail");
const User = require("../models/User");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', async (req, res) => {
    try {
        let published = {published: true}
        const cocktails = await Cocktail.find(published).populate("user");
        res.send(cocktails);
    } catch {
        res.sendStatus(500);
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const userId = req.params.id
        const cocktails = await Cocktail.find({user: userId}).populate("user");
        res.send(cocktails);
    } catch {
        res.sendStatus(500);
    }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
    const cocktailData = req.body;

    const token = req.get('Authorization');
    const userToken = await User.findOne({token});

    cocktailData.user = userToken._id;
    if (req.file) {
        cocktailData.image = req.file.filename;
    }

    if (cocktailData.ingredients) {
        cocktailData.ingredients = JSON.parse(cocktailData.ingredients);
    }

    const cocktail = new Cocktail(cocktailData);
    try {
        await cocktail.save();
        res.send(cocktail);
    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = router;