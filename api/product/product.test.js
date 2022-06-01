const supertest = require("supertest");
const app = require("../../app");
const server = require("../../index");
const mongoose = require("mongoose");
const Product = require("./product.model");
const User = require("../user/user.model");
const api = supertest(app);
const { initialProduct } = require("../../mock/testData");
describe("test for product", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    await User.deleteMany({});
    await Product.insertMany(initialProduct);
  });
  test("get product detail", async () => {
    const { _id } = await Product.findOne({ name: "test1" });

    await api
      .get(`/api/v1/product/${_id.toString()}`)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .expect((res) => {
        expect(res.body.data._id).toBe(_id.toString());
      });
  });

  test("create product", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test@gmail.com",
      password: "test333",
      role: "admin",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .post("/api/v1/admin/product/new")
        .send({
          name: "test3",
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
        })
        .set("Cookie", `token=${token}`)
        .expect(201)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body.data.name).toBe("test3");
        });
    }
  });
});

describe("test for product failed", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    await Product.insertMany(initialProduct);
  });
  test("get product detail fail", async () => {
    await api
      .get(`/api/v1/product/5e9f9f9f9f9f9f9f9f9f9f9`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe(
          "Product not found with id 5e9f9f9f9f9f9f9f9f9f9f9"
        );
      });
  });
  test("create product fail", async () => {
    await api
      .post("/api/v1/admin/product/new")
      .send({
        name: "test3",
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
      })

      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe(
          "Inicie sesión para acceder a este recurso"
        );
      });
  });
});
afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
