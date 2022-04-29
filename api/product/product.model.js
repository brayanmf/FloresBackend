const mongoose = require("mongoose"); //create a schema for product
//se podria decir que es tabla de productos
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please Enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please Enter product price"],
      maxLength: [8, "Price cannot exceed 8 digits"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true,
          default:
            "Sudadera-con-capucha-de-One-piece-para-hombre-ropa-con-estampado-de-barba-blanca-Portgas-D.jpg_Q90.jpg__blrayz",
        },
        url: {
          type: String,
          required: true,
          default:
            "https://res.cloudinary.com/dx1ece9ck/image/upload/v1651177829/store/clothing/Sudadera-con-capucha-de-One-piece-para-hombre-ropa-con-estampado-de-barba-blanca-Portgas-D.jpg_Q90.jpg__blrayz.webp",
        },
      },
    ],
    gender: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "Please Enter product category"],
    },

    Stock: {
      type: Number,
      required: [true, "Please Enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 digits"],
      default: 1,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Product", productSchema);
