const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Correo electronico es requerido"],
      unique: true,
      trim: true,
      validate: [
        validator.isEmail,
        "Por favor introduzca una dirección de correo electrónico válida",
      ],
    },
    password: {
      type: String,
      required: [true, "Ingresa tu contraseña"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres."],
      validate: [
        validator.isLength,
        "La contraseña debe tener al menos 6 caracteres.",
      ],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    avatar: {
      public_id: {
        type: String,
        required: true,
        default: "istockphoto-1130884625-612x612_cwvfdf",
        trim: true,
      },
      url: {
        type: String,
        required: true,
        trim: true,
        default:
          "https://res.cloudinary.com/dx1ece9ck/image/upload/v1651166764/store/users/istockphoto-1130884625-612x612_cwvfdf.jpg",
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordToken = hashedToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
