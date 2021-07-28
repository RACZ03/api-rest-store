import request from "supertest"
import app from "../src/app.js"


describe('GET /APP', () => {

    it('It should show project information', async () => {
        const response = await request(app).get('/') //Define the end point
                                           .set('Accept', 'application/json') //Headers

        expect( response.error ).toBe(false) // It does not return errors
        expect( response.status ).toBe(200) // Success
        expect( response.body).not.toBeNull() // Do not return null the body
    });                                                         

});