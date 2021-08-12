import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    idCat: '611543c2f1169e8d1723620c',
    name: 'Deportivos'
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDFiNTY2ZTQ4MDU5NGM5YzE3MTA5ZiIsImlhdCI6MTYyODc4MjAxMiwiZXhwIjoxNjI4ODY4NDEyfQ.c-7i9xBq0erXs7qaMZjZr8Rep2rFLp5GWIwOVjbo6AI';

const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTUzZWE4YTExNDY0MWMxNDFiZjJlNiIsImlhdCI6MTYyODc4MjMwNSwiZXhwIjoxNjI4ODY4NzA1fQ.YUnq8iGOnxHtCbx_JBR_gML7jneI_iwZj-4uLwQhfkg';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

// Test endpoint save new subcategory
describe('POST /subCategory', () => { 

    it('Should return no token provided', async () => {
        const response = await request(app).post('/api/subCategory/')
                                           .set('Accept', 'application/json')
                                           .set('tokenw', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('No token provided') // I should answer this message
    });

    it('It should not have a role admin or moderate', async () => {
  
        const response = await request(app).post('/api/subcategory')
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
    
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message

   });

    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        const response = await request(app).post('/api/subCategory')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    // it('Should POST a new  subcategory', async () => {
    //     const response = await request(app).post('/api/subCategory') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json') //Headers
    //                                        .set('token', tokenAdmin);

    //     expect( response.status ).toBe(201)
    //     expect( response.body ).not.toBeNull() // Do not return null the body
    // } );   

    it('Should return the subcategory already exists', async () => {
        const response = await request(app).post('/api/subCategory') //Define the end point
                                           .send(data)  // Object to send
                                           .set('Accept', 'application/json') //Headers
                                           .set('token', tokenAdmin);
        expect( response.status ).toBe(409)
        expect( response.body.message ).toEqual('The subcategory already exists!') // I should answer this message
    });   

});

// Test get all subcategories
describe('GET ALL /subCategory', () => {

    
    it('Should return subcategories', async () => {
    
        const response = await request(app).get('/api/subCategory/')
                                           .set('Accept', 'application/json');
    
        expect( response.error ).toBe(false) // Don't exist errors
        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.subCategories ) ).toBe(true); // Is an arrangement
    });

});

