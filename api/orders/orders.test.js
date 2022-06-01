const supertest = require("supertest");
const app = require("../../app");
const server = require("../../index");
const mongoose = require("mongoose");
const Order = require("./orders.model");
const User = require("../user/user.model");
const api = supertest(app);
const { initialOrder } = require("../../mock/testData");
describe("test for order", () => {
  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Order.insertMany(initialOrder);
  });
  test("get order detail", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test@gmail.com",
      password: "test333",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      const { _id } = await Order.findOne({
        orderStatus: "ProcessingTest",
      });

      await api
        .get(`/api/v1/order/${_id.toString()}`)
        .set("Cookie", `token=${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body.data._id).toBe(_id.toString());
        });
    }
  });
  test("new order", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test@gmail.com",
      password: "test333",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .post("/api/v1/order/new")
        .send({
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

          itemPrice: 0,
          taxPrice: 720,
          shippingPrice: 0,
          totalPrice: 4720,
          orderStatus: "ProcessingTest",

          __v: 0,
        })
        .set("Cookie", `token=${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body.data.orderStatus).toBe("ProcessingTest");
        });
    }
  });
});

describe("test for order failed", () => {
  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Order.insertMany(initialOrder);
  });
  test("get order detail fail", async () => {
    const { _id } = await Order.findOne({
      orderStatus: "ProcessingTest",
    });

    await api
      .get(`/api/v1/order/${_id.toString()}`)
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe(
          "Inicie sesión para acceder a este recurso"
        );
      });
  });

  test("new order fail", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test@gmail.com",
      password: "test333",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .post("/api/v1/order/new")
        .send({
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
        })
        .set("Cookie", `token=${token}`)
        .expect(500)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          console.log(res.body);
          expect(res.body.message).toBe(
            "Order validation failed: totalPrice: Path `totalPrice` is required."
          );
        });
    }
  });
});
afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
