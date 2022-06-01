const mongoose = require("mongoose");

const initialUser = [
  {
    email: "test1@gmail.com",
    password: "test11",
    avatar: {
      public_id: "test1",
      url: "test1",
    },
  },
  {
    email: "test2@gmail.com",
    password: "test222@gmail.com",
    avatar: {
      public_id: "test2",
      url: "test2",
    },
  },
];

const initialProduct = [
  {
    name: "test1",
    price: 150,
    description: "sombrero de Anime One Piece",
    category: "sombreros",
    gender: "masculino",
    Stock: 50,
    images: [
      {
        public_id: "Portgas-D-ace-de-una-pieza-para-Cosplay",
        url: "https://res.cloudinary.com/dx1ece9ck/image/upload/v1653155703/store/clothing/Portgas-D-ace-de-una-pieza-para-Cosplay.jpg",
      },
    ],
    user: mongoose.Types.ObjectId(),
  },
  {
    name: "test2",
    price: 250,
    description: "sombrero de Anime One Piece",
    category: "sombreros",
    gender: "masculino",
    Stock: 50,
    images: [
      {
        public_id: "Portgas-D-ace-de-una-pieza-para-Cosplay",
        url: "https://res.cloudinary.com/dx1ece9ck/image/upload/v1653155703/store/clothing/Portgas-D-ace-de-una-pieza-para-Cosplay.jpg",
      },
    ],
    user: mongoose.Types.ObjectId(),
  },
];

const initialOrder = [
  {
    _id: mongoose.Types.ObjectId(),

    shippingInfo: {
      address: "jr.joaquin 2451",
      city: "lima",
      state: "LIM",
      country: "PE",
      codePost: 154,
      phoneNo: 545415545,
    },
    orderItems: [
      {
        name: "producto",
        price: 1500,
        quantity: 1,
        image:
          "https://res.cloudinary.com/dx1ece9ck/image/upload/v1651177829/store/clothing/Sudadera-con-capucha-de-One-piece-para-hombre-ropa-con-estampado-de-barba-blanca-Portgas-D.jpg_Q90.jpg__blrayz.webp",
        _id: mongoose.Types.ObjectId(),
      },
      {
        name: "producto4",
        price: 2500,
        quantity: 1,
        image:
          "https://res.cloudinary.com/dx1ece9ck/image/upload/v1651177829/store/clothing/Sudadera-con-capucha-de-One-piece-para-hombre-ropa-con-estampado-de-barba-blanca-Portgas-D.jpg_Q90.jpg__blrayz.webp",
        _id: mongoose.Types.ObjectId(),
      },
    ],
    paymentInfo: {
      id: "1248143534",
      status: "approved",
    },
    paidAt: new Date(),
    itemPrice: 0,
    taxPrice: 720,
    shippingPrice: 0,
    totalPrice: 4720,
    orderStatus: "ProcessingTest",
    user: mongoose.Types.ObjectId(),
    __v: 0,
  },
];

module.exports = { initialUser, initialProduct, initialOrder };
