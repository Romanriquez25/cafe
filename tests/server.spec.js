const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
  it("GET /cafes status 200, responds with array of objects and at least one object", async () => {
    const url = "/cafes";
    const response = await request(server).get(url);
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0] instanceof Object).toBe(true);
    expect(response.body[0]).toHaveProperty("id");
  });
  it("DELETE /cafes/:id status 404 when id is not found", async () => {
    const token = "123";
    const url = "/cafes/999";
    const response = await request(server)
      .delete(url)
      .set("Authorization", `Bearer ${token}`);
    // console.log(response.statusCode);
    expect(response.statusCode).toBe(404);
  });
  it("POST /cafes status 201, adds a coffee", async () => {
    const newCafe = {
      id: 998,
      nombre: "Cafe 998",
    };
    const response = await request(server).post("/cafes").send(newCafe);
    expect(response.statusCode).toBe(201);
    expect(
      response.body.some(
        (cafe) => cafe.id === newCafe.id && cafe.nombre === newCafe.nombre
      )
    ).toBe(true);
  });
  it("PUT /cafes returns status code 400 for mismatched IDs", async () => {
    const cafeId = "1";
    const newCafeData = {
      id: "2",
      nombre: "Updated Cafe Name",
    };

    const response = await request(server)
      .put(`/cafes/${cafeId}`)
      .send(newCafeData);
    // console.log(response.body);
    expect(response.statusCode).toBe(400);
  });
});
