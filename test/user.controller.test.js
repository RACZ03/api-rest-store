import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

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

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDE5M2UwMzI4YzQzMTg3MDFmODFhYSIsImlhdCI6MTYyNzUyNTg5MCwiZXhwIjoxNjI3NjEyMjkwfQ.vLgQX1IfLNpRv_w-5PU7ePYsjow3Z_PsZeI029t4d8Q';
// Admin user Token
const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyNzUyOTY5NCwiZXhwIjoxNjI3NjE2MDk0fQ.mCB259hvMnp4OOGRxSH3nisvd1HElNMxBy7lmiV2xQU';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

describe('POST /auth/signup', () => {

    // it('Should POST a new  users', async () => {
    //     const response = await request(app).post('/api/auth/signup') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json'); //Headers
    //     expect( response.status ).toBe(201)
    //     // expect( response.body.email ).toEqual('steve@gmail.com')
    //     expect( response.body.email ).toMatch(/@/); // The string must contain an @
    //     // expect( response.body).not.toBeNull() // Do not return null the body
    // }, 20000 );    
    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.username =  '';
        data2.email = 'steveError.gmail.com';
        const response = await request(app).post('/api/auth/signup')
                                           .send( data2 )
                                           .set('Accept', 'application/json');
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    // expect.extend({
    //     async verifyUser ( email ) {
            
    //     }
    // })
    

});


describe('POST /auth/signin', () => { 

    it('should answer user not found', async () => {
        let data2 = { ...data };
        data2.email = 'steveFaild@gmail.com';
        
        const response = await request(app).post('/api/auth/signin')
                                           .send( data2 )
                                           .set('Accept', 'application/json');
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('User not found') // I should answer this message
    });

    it('Should return wrong password', async () => {
        let data2 = { ...data };
        data2.email = 'steve@gmail.com';
        data2.password = 'error1234';
        
        const response = await request(app).post('/api/auth/signin')
                                           .send( data2 )
                                           .set('Accept', 'application/json');
        expect( response.status ).toBe(401)
        expect( response.body.message ).toEqual('Invalid password') // I should answer this message
    });

    it('should receive a token', async () => {
        const response = await request(app).post('/api/auth/signin')
                                           .send( data )
                                           .set('Accept', 'application/json');
        expect( response.status ).toBe(200)
        expect( response.body.token ).not.toBeNull() // don't be null
    });

});

describe('GET /user/', () => {

    it('Should return no token provided', async () => {
        const response = await request(app).get('/api/user/')
                                     .set('Accept', 'application/json')
                                     .set('tokenError', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('No token provided') // I should answer this message
    });

    it('Should return user not found', async () => {
        const invalidToken = 'aaaaaaaaa';
        const response = await request(app).get('/api/user/')
                                     .set('Accept', 'application/json')
                                     .set('token', invalidToken);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('No user found') // I should answer this message
    });

    it('It should not have a user role', async () => {
        const response = await request(app).get('/api/user/')
                                     .set('Accept', 'application/json')
                                     .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message
    });

    it('Should return users', async () => {

        const response = await request(app).get('/api/user/')
                                     .set('Accept', 'application/json')
                                     .set('token', Admintoken);

        expect( response.error ).toBe(false) // Don't exist errors
        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.users ) ).toBe(true); // Is an arrangement
    });
});