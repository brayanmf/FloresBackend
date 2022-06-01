const supertest = require("supertest");
const app = require("./../app");
const server = require("./../index");
const mongoose = require("mongoose");
const User = require("./../api/user/user.model");
const api = supertest(app);
const { initialUser } = require("./../mock/testData");

describe("test for auth", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUser);
  });

  test("register user", async () => {
    await api
      .post("/api/v1/register")
      .send({
        name: "test",
        email: "brayanm.flores321@gmail.com",
        password: "123456313232",
      })
      .expect(201)
      .expect("Content-Type", /application\/json/);
  });
  test("login user", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test3@gmail.com",
      password: "test333",
    });

    if (!response.body.sucess) {
      await api
        .post("/api/v1/login")
        .send({
          email: "test3@gmail.com",
          password: "test333",
        })
        .expect(200)
        .expect("Content-Type", /application\/json/)
        .expect("set-cookie", /token/);
    }
  });
});
describe("test for auth failed", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUser);
  });
  test("register user fail", async () => {
    await api
      .post("/api/v1/register")
      .send({
        email: "test2@gmail.com",
      })
      .expect(400)
      .expect("Content-Type", /application\/json/);
  });
  test("login user fail", async () => {
    const response = await api.post("/api/v1/register").send({
      email: "test3@gmail.com",
      password: "test333",
    });

    if (!response.body.sucess) {
      await api
        .post("/api/v1/login")
        .send({
          email: "test3@gmail.com",
          password: "3212212e1",
        })
        .expect(401)
        .expect("Content-Type", /application\/json/);
    }
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.close();
});
