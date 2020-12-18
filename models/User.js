const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {nanoid} = require("nanoid");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, "Поле username обязательно для заполнения"],
        unique: true,
        validate: {
            validator: async (value) => {
                const user = await User.findOne({username: value});
                if (user) return false;
            },
            message: (props) => `Пользователь ${props.value} уже существует`
        }
    },
    email: {
        type: String,
        required: [true, "Поле email обязательно для заполнения"],
        unique: true,
        validate: {
            validator: async (value) => {
                const user = await User.findOne({email: value});
                if (user) return false;
            },
            message: (props) => `Почта ${props.value} уже используется`
        }
    },
    password: {
        type: String,
        required: [true, "Поле password обязательно для заполнения"],
        minlength: [8, "Минимальная длина пароля 8 символов"],
        validate: {
            validator: (value) => {
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g.test(value);
            },
            message: "Пароль слишком простой"
        }
    },
    token: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: 'user',
        enum: ['user', 'admin']
    },
    facebookImage: String,
    facebookId: String,
    displayName: {
    type: String,
        required: [true, "Поле display name обязательно для заполнения"],
        unique: true,
        validate: {
        validator: async (value) => {
            const user = await User.findOne({displayName: value});
            if (user) return false;
        },
            message: (props) => `Пользователь ${props.value} уже существует`
    }
},
});

UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function() {
    this.token = nanoid();
};

const User = mongoose.model("User", UserSchema);

module.exports = User;