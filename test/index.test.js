const request = require('supertest');
const app = require('../src/index');


describe("get routes", () => {
    test("root route", async () => {
        const response = await request(app).get("/")
        expect(response.body).toBeDefined()
    });
    test("create user", async () => {
        const response = await request(app).get("/create")
        expect(response.body).toBeDefined()
    });

    test("list user", async () => {
        const response = await request(app).get("/list")
        expect(response.body).toBeDefined()
    });

    test("update user", async () => {
        const response = await request(app).get("/update")
        expect(response.body).toBeDefined()
    });

    test("delete user", async () => {
        const response = await request(app).get('/delete')
        expect(response.body).toBeDefined()
    });
});

describe("action routes", () => {
    test("create user", async () => {
        const response = await request(app).post("/create").send({
            name: "testingjest"
        })
        expect(response.body).toBeDefined()
    });

    test("update user", async () => {
        const response = await request(app).put("/update").send({
            name: "testingjest",
            newName: "jest"
        })
        expect(response.body).toBeDefined()
    });

    test("delete user", async () => {
        const response = await request(app).delete('/delete').send({
            name: "jest"
        });
        expect(response.body).toBeDefined()
    });
});


