const supertest = require("supertest");
const app = require("../../app");
const server = require("../../index");
const mongoose = require("mongoose");
const User = require("./user.model");
const api = supertest(app);
const { initialUser } = require("../../mock/testData");
describe("test for user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUser);
  });
  test("get user detail", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test6@gmail.com",
      password: "test333",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .get("/api/v1/user/me")
        .set("Cookie", `token=${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/);
    }
  });
  test("get user all", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test6@gmail.com",
      password: "test333",
      role: "admin",
    });

    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .get("/api/v1/user/getAll")
        .set("Cookie", `token=${token}`)
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect((res) => {
          expect(res.body.data.length).toBe(3);
        });
    }
  });
});

describe("test for user failed", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUser);
  });
  test("get user detail fail", async () => {
    await api
      .get("/api/v1/user/me")
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe(
          "Inicie sesión para acceder a este recurso"
        );
      });
  });
  test("get user all fail", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test6@gmail.com",
      password: "test333",
    });
    const token = await response.headers["set-cookie"][0]
      .split(";")[0]
      .slice(6);

    if (!response.body.sucess) {
      await api
        .get("/api/v1/user/getAll")
        .set("Cookie", `token=${token}`)
        .expect(403)
        .expect((res) => {
          expect(res.body.message).toBe(
            "No está autorizado para acceder a este recurso"
          );
        });
    }
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
