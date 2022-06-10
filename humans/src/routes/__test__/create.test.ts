import request from "supertest";
// import { app } from "../../app";

// creating tests in prod...

const BASE_URL = `http://localhost:3001`

it("creates", async () => {

    await request(BASE_URL).post("/api/human").send({
    title: "test",
  }).expect(200);

  const user = await request(BASE_URL).get("/api/humans").send({
    title: "test",
  });

  console.log(user.body)

  expect(user.body.title).toEqual('test');
});

