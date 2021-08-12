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
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyODczMzIxMCwiZXhwIjoxNjI4ODE5NjEwfQ.6o7cD4G-1tQe4n7DucrPLmoF-OqRBYC4FGbG8b5ws2c';
// Admin user Token
// const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyNzUyOTY5NCwiZXhwIjoxNjI3NjE2MDk0fQ.mCB259hvMnp4OOGRxSH3nisvd1HElNMxBy7lmiV2xQU';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

describe('POST /auth/signup', () => { 
    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.username =  '';
        data2.email = 'ste.gmail.com';
        const response = await request(app).post('/api/auth/signup')
                                           .send( data2 )
                                           .set('Accept', 'application/json');
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    it('Should return the user already exists', async () => {
        const response = await request(app).post('/api/auth/signup') //Define the end point
                                           .send(data)  // Object to send
                                           .set('Accept', 'application/json'); //Headers
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('The user already exists') // I should answer this message
    });   
        
    // it('Should POST a new  users', async () => {
    //     const response = await request(app).post('/api/auth/signup') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json'); //Headers
    //     expect( response.status ).toBe(201)
    //     // expect( response.body.email ).toEqual('steve@gmail.com')
    //     expect( response.body.email ).toMatch(/@/); // The string must contain an @
    //     // expect( response.body ).not.toBeNull() // Do not return null the body
    // }, 20000 );   

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

    // it('should receive a token', async () => {
    //     const response = await request(app).post('/api/auth/signin')
    //                                        .send( data )
    //                                        .set('Accept', 'application/json');
    //     expect( response.status ).toBe(200)
    //     expect( response.body.token ).not.toBeNull() // don't be null
    // });

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

    // it('It should not have a user role', async () => {
    //     const response = await request(app).get('/api/user/')
    //                                  .set('Accept', 'application/json')
    //                                  .set('token', token);

    //     // expect( response.error ).toBe(true) // Exist errors
    //     expect( response.status ).toBe(403)
    //     expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message
    // });

    // it('Should return users', async () => {

    //     const response = await request(app).get('/api/user/')
    //                                  .set('Accept', 'application/json')
    //                                  .set('token', Admintoken);

    //     expect( response.error ).toBe(false) // Don't exist errors
    //     expect( response.status ).toBe(200)
    //     expect( Array.isArray( response.body.users ) ).toBe(true); // Is an arrangement
    // });
});

describe('GET /user/{id}', () => {

    let id = '610ca28048efb525dc5b3022';
    it('User does not exist 2', async () => {
        const response = await request(app).get(`/api/user/${ id }`)
                                     .set('Accept', 'application/json')
                                     .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The user does not exists') // I should answer this message
    });

    let id2 = '610ca28048efb525dc5b3020';
    it('Should return a user', async () => {
        const response = await request(app).get(`/api/user/${ id2 }`)
                                     .set('Accept', 'application/json')
                                     .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(200)
        expect( response.body.user ).not.toBeNull() // Do not return null the body
    });
});

describe('PUT /user/{id}', () => {
    let id = '610193e0328c4318701f81aa';
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.username =  '';
        data2.email = 'steveError.gmail.com';
        const response = await request(app).put(`/api/user/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    let idf = '610193e0328c4318701f82aa';
    it('User does not exist', async () => {
        const response = await request(app).put(`/api/user/${ idf }`)
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The user does not exists') // I should answer this message
    });

    let id3 = '610193e0328c4318701f81aa';
    it('Should return a user', async () => {
        let datau = { ...data };
        datau.photo = 'profileSteve.png';
        delete datau.idRole;
        delete datau.password;
        const response = await request(app).put(`/api/user/${ id3 }`)
                                           .send( datau )
                                           .set('Accept', 'application/json')
                                           .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(200)
        expect( response.body.user ).not.toBeNull() // Do not return null the body
    });
});

describe('DELETE /user/{id}', () => {
    let idf = '610193e0328c4318701f01aa';
    it('User does not exists', async () => {
        const response = await request(app).delete(`/api/user/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The user does not exists') // I should answer this message
    });

    let id= '610ca28048efb525dc5b3020';
    it('User deleted', async () => {
        const response = await request(app).delete(`/api/user/${ id }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('User deleted') // I should answer this message
    });
});

describe('GET /user/avatar/{filename}', () => {
    it('Image does not exists', async () => {
        let filename = 'error-xMD16.jpg';
        const response = await request(app).get(`/api/user/avatar/${ filename }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('Avatar does not exists') // I should answer this message
    });

    it('Return image', async () => {
        let filename = '5FwA8r233UPH_G5LlY-xMD16.jpg';
        const response = await request(app).get(`/api/user/avatar/${ filename }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(200)
    });
})