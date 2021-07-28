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

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

describe('POST /auth/signup', () => {

    it('Should POST a new  users', async () => {
        const response = await request(app).post('/api/auth/signup') //Define the end point
                                           .send(data)  // Object to send
                                           .set('Accept', 'application/json'); //Headers
        expect( response.status ).toBe(201)
        // expect( response.body.email ).toEqual('steve@gmail.com')
        expect( response.body.email ).toMatch(/@/); // The string must contain an @
        expect( response.body).not.toBeNull() // Do not return null the body
    }, 20000 );    
    
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
});