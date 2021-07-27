import request from "supertest"
import app from "../src/app.js"


describe('POST /auth/signup', () => {
    // Define object
    const data =  {
        idRole: '',
        username: 'Steve Harris',
        email: 'steve@gmail.com',
        password: '123456',
        photo: '',
        phoneNumber: 88887777,
        status: true
    };

    it('Should POST a new  users', async () => {
        const response = await request(app).post('/api/auth/signup') //Define the end point
                                           .send(data)  // Object to send
                                           .set('Accept', 'application/json') //Headers
        expect( response.status ).toBe(200)
        // expect( response.body.email ).toEqual('steve@gmail.com')
        expect( response.body.email ).toMatch(/@/); // The string must contain an @
        expect( response.body).not.toBeNull() // Do not return null the body
    });                                                         

  });