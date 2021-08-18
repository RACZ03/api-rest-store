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

// Test get all products
describe('GET ALL /products', () => {

    
    it('Should return products', async () => {
    
        const response = await request(app).get('/api/product/')
                                           .set('Accept', 'application/json');
    
        expect( response.error ).toBe(false) // Don't exist errors
        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.products ) ).toBe(true); // Is an arrangement
    });

});

// Test, looking for a product by id
describe('GET BY ID /product/{id}', () => {

    // const id = '611c1bf8fdea6d4230c4b561';
    const idFaild = '61154519d56f305a20b5114a';
    it('Should return product not found', async () => {

        const response = await request(app).get(`/api/product/${ idFaild }`)

        expect( response.status ).toBe(404);
    });

    // it('Should return a product', async () => {

    //     const response = await request(app).get(`/api/product/${ id }`)

    //     expect( response.status ).toBe(200);
    //     expect( response.body.product ).not.toBeNull(); // Do not return null the body
    // });
});


// Delete product
describe('DELETE /product/{id}', () => {
    let idf = '610193e0328c4318701f01aa';
    it('Product does not exists', async () => {
        const response = await request(app).delete(`/api/product/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The product does not exists') // I should answer this message
    });

    let id= '611c1bf8fdea6d4230c4b561';
    it('Product deleted', async () => {
        const response = await request(app).delete(`/api/product/${ id }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Product deleted') // I should answer this message
    });
});