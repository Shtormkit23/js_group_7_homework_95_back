const router = require("express").Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");
const Cocktail = require("../models/Cocktail");

router.get('/cocktails', [auth, permit('admin')], async (req, res) => {
    try {
        const cocktails = await Cocktail.find().populate("user")
        res.send(cocktails);
    } catch(e) {
        res.send(500);
    }
});

router.put("/cocktails/:id", [auth, permit('admin')], async (req, res) => {
    try {
        const cocktail = await Cocktail.findById(req.params.id);
        cocktail.published = !cocktail.published
        await cocktail.save();
        return res.send({ message: `${req.params.id} published` });
    } catch (e) {
        return res.status(422).send(e);
    }
});

router.delete("/cocktails/:id", [auth, permit('admin')], async (req, res) => {
    try {
        await Cocktail.findOneAndRemove({_id: req.params.id});
        return res.send({ message: `${req.params.id} removed` });
    } catch (e) {
        return res.status(422).send(e);
    }
});

module.exports = router;