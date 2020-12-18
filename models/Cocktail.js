const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CocktailSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Поле title обязательно для заполнения"]
    },
    recipe: {
        type: String,
        required: [true, "Поле recipe обязательно для заполнения"]
    },
    image: String,
    published: {
        type: Boolean,
        required: true,
        default: "false",
        enum: ["false", "true"]
    },
    ingredients: {
        type: Array
    }
});

const Cocktail = mongoose.model("Cocktail", CocktailSchema);
module.exports = Cocktail;