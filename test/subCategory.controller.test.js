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
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDFiNTY2ZTQ4MDU5NGM5YzE3MTA5ZiIsImlhdCI6MTYyOTIyOTk5NSwiZXhwIjoxNjI5MzE2Mzk1fQ.nHlhHWu4ezlmGdQ0qDBpVU5Cbq0DMxfpMjHhzrfs9_4';

const tokenAdmin = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTUzZWE4YTExNDY0MWMxNDFiZjJlNiIsImlhdCI6MTYyOTIyODgyNSwiZXhwIjoxNjI5MzE1MjI1fQ.5GRwNNkZgAyozZKpYj712gpXRvyRm7gumawvSAUsO4E';

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

// Test, looking for a SubCategory by id
describe('GET BY ID /subcategory/{id}', () => {

    const id = '611c1bf8fdea6d4230c4b561';
    const idFaild = '61154519d56f305a20b5114a';
    it('Should return Subcategory not found', async () => {

        const response = await request(app).get(`/api/subCategory/${ idFaild }`)

        expect( response.status ).toBe(404);
    });

    it('Should return a subcategory', async () => {

        const response = await request(app).get(`/api/subCategory/${ id }`)

        expect( response.status ).toBe(200);
        expect( response.body.subcategory ).not.toBeNull(); // Do not return null the body
    });
});


describe('PUT /subCategory/{id}', () => {
    let id = '611c1bf8fdea6d4230c4b561';
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        const response = await request(app).put(`/api/subCategory/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    let idf = '610193e0328c4318701f82aa';
    it('SubCategory does not exist', async () => {
        const response = await request(app).put(`/api/subCategory/${ idf }`)
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The subcategory does not exists') // I should answer this message
    });

    let id3 = '611c1bf8fdea6d4230c4b561';
    it('Should return success', async () => {
        let datasub = { ...data };
        datasub.name = 'Deportivos';
        const response = await request(app).put(`/api/subCategory/${ id3 }`)
                                           .send( datasub )
                                           .set('Accept', 'application/json')
                                           .set('token', tokenAdmin);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(200)
        expect( response.body.subCategory ).not.toBeNull() // Do not return null the body
    });
});

// Delete subcategory
describe('DELETE /subCategory/{id}', () => {
    let idf = '610193e0328c4318701f01aa';
    it('SubCategory does not exists', async () => {
        const response = await request(app).delete(`/api/subCategory/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The Subcategory does not exists') // I should answer this message
    });

    let id= '611c1bf8fdea6d4230c4b561';
    it('Subcategory deleted', async () => {
        const response = await request(app).delete(`/api/subCategory/${ id }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Subcategory deleted') // I should answer this message
    });
});