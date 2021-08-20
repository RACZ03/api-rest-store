import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    name: 'Nike'
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTVlNTVjODU4MTRkMjBmMDk2MjVhYyIsImlhdCI6MTYyOTQyNjQ1OCwiZXhwIjoxNjI5NTEyODU4fQ.DbSNl4nguL1ChCzf022u_aYXdOL9hmOynZ_cefrmNK4';

const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyOTQyNjQyNSwiZXhwIjoxNjI5NTEyODI1fQ.BH54R_54JUpBg-abR52u5vRoAwPHAUKwc910cEQjhmM';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

// Test endpoint save new brand
describe('POST /Brand', () => { 

    it('Should return no token provided', async () => {
        const response = await request(app).post('/api/brand/')
                                           .set('Accept', 'application/json')
                                           .set('tokenw', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('No token provided') // I should answer this message
    });

    it('It should not have a role admin or moderate', async () => {
  
        const response = await request(app).post('/api/brand')
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message

   });

    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        const response = await request(app).post('/api/brand')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    // it('Should POST a new  brand', async () => {
    //     const response = await request(app).post('/api/brand') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json') //Headers
    //                                        .set('token', tokenAdmin);

    //     expect( response.status ).toBe(201)
    //     expect( response.body ).not.toBeNull() // Do not return null the body
    // } );   

    it('Should return the brand already exists', async () => {
        const response = await request(app).post('/api/brand') //Define the end point
                                           .send(data)  // Object to send
                                           .set('Accept', 'application/json') //Headers
                                           .set('token', tokenAdmin);
        expect( response.status ).toBe(409)
        expect( response.body.message ).toEqual('The brand already exists!') // I should answer this message
    });   

});

// Test get all brand
describe('GET ALL /brand', () => {

    
    it('Should return brands', async () => {
    
        const response = await request(app).get('/api/brand/')
                                           .set('Accept', 'application/json');
    
        expect( response.error ).toBe(false) // Don't exist errors
        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.brands ) ).toBe(true); // Is an arrangement
    });

});

// Test, looking for a Brand by id
describe('GET BY ID /brand/{id}', () => {

    const id = '611f16a5a3372e1e24f892a3';
    const idFaild = '61154519d56f305a20b5114a';
    it('Should return brand not found', async () => {

        const response = await request(app).get(`/api/brand/${ idFaild }`)

        expect( response.status ).toBe(404);
    });

    it('Should return a brand', async () => {

        const response = await request(app).get(`/api/brand/${ id }`)

        expect( response.status ).toBe(200);
        expect( response.body.brand ).not.toBeNull(); // Do not return null the body
    });
});


describe('PUT /brand/{id}', () => {
    let id = '611c1bf8fdea6d4230c4b561';
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        const response = await request(app).put(`/api/brand/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    let idf = '610193e0328c4318701f82aa';
    it('Brand does not exist', async () => {
        const response = await request(app).put(`/api/brand/${ idf }`)
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The brand does not exists') // I should answer this message
    });

    let id3 = '611f135eefca4e36d07996ad';
    // it('Should return success', async () => {
    //     let dataupdate = { ...data };
    //     dataupdate.name = 'Nikes';
    //     const response = await request(app).put(`/api/brand/${ id3 }`)
    //                                        .send( dataupdate )
    //                                        .set('Accept', 'application/json')
    //                                        .set('token', tokenAdmin);

    //     // expect( response.error ).toBe(true) // Exist errors
    //     expect( response.status ).toBe(200)
    //     expect( response.body.brand ).not.toBeNull() // Do not return null the body
    // });
});

// Delete brand
describe('DELETE /brand/{id}', () => {
    let idf = '610193e0328c4318701f01aa';
    it('Brand does not exists', async () => {
        const response = await request(app).delete(`/api/brand/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The brand does not exists') // I should answer this message
    });

    // let id= '611f16a5a3372e1e24f892a3';
    // it('Brand deleted', async () => {
    //     const response = await request(app).delete(`/api/brand/${ id }`)
    //                                        .set('Accept', 'application/json')
    //                                        .set('token', tokenAdmin);
    //     expect( response.status ).toBe(200)
    //     expect( response.body.message ).toEqual('Brand deleted') // I should answer this message
    // });
});