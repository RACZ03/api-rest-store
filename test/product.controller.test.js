import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    idBrand:'612119ec8781ea21e88677ad',
    idSubCategory:'611c1bf8fdea6d4230c4b561',
    idUser: '61153ea8a114641c141bf2e6',
    name: 'Test by jest',
    description: 'Description',
    price: 20,
    discount: 10,
    stoke: 10,
    photos: ['image1.png', 'image2.png']
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDFiNTY2ZTQ4MDU5NGM5YzE3MTA5ZiIsImlhdCI6MTYyOTU2MTg2OCwiZXhwIjoxNjI5NjQ4MjY4fQ.3wTfLzHswzG-XmO80x2o99IZm4dc1CEIG9l5KssUAM8';
// Admin user Token
const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMTUzZWE4YTExNDY0MWMxNDFiZjJlNiIsImlhdCI6MTYyOTU2MTc1MywiZXhwIjoxNjI5NjQ4MTUzfQ.afzrX3OTTAt7RXS9vSxcPwFjfZZ29KNkgbRY1LsBIqU';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

// Test endpoint save new product
describe('POST /product', () => { 

    it('Should return no token provided', async () => {
        const response = await request(app).post('/api/product/')
                                           .set('Accept', 'application/json')
                                           .set('tokenw', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('No token provided') // I should answer this message
    });

    it('It should not have a role admin or moderate', async () => {
  
        const response = await request(app).post('/api/product')
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message

   });

    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        data2.description =  '';
        const response = await request(app).post('/api/product')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    it('it should return id brand does not exist', async () => {
        let data2 = { ...data };
        data2.idBrand =  '612119ec8781ea21e88677af';
        const response = await request(app).post('/api/product')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('There is no brand with that id') // I should answer this message

    });

    it('it should return id subcategory does not exist', async () => {
        let data2 = { ...data };
        data2.idSubCategory =  '611c1bf8fdea6d4230c4b568';
        const response = await request(app).post('/api/product')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('There is no subcategory with that id') // I should answer this message

    });

    it('it should return Wrong id', async () => {
        let data2 = { ...data };
        data2.idSubCategory =  '611c1bf8fdea6d4230c4b56qqwqwqweqweqweqweqwe';
        const response = await request(app).post('/api/product')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('Wrong id') // I should answer this message

    });

    // it('Should POST a new  product', async () => {
    //     const response = await request(app).post('/api/product') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json') //Headers
    //                                        .set('token', Admintoken);

    //     expect( response.status ).toBe(201)
    //     expect( response.body ).not.toBeNull() // Do not return null the body
    // } );      
});

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

    let id = '61212035b00104279cdbc445';
    it('Should return a product', async () => {

        const response = await request(app).get(`/api/product/${ id }`)

        expect( response.status ).toBe(200);
        expect( response.body.product ).not.toBeNull(); // Do not return null the body
    });
});

// Update product
describe('PUT /product/{id}', () => {
    let id = '6121285ad892653d8cd0b202';
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.name =  '';
        const response = await request(app).put(`/api/product/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    it('it should return id brand does not exist', async () => {
        let data2 = { ...data };
        data2.idBrand =  '612119ec8781ea21e88677af';
        const response = await request(app).put(`/api/product/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('There is no brand with that id') // I should answer this message

    });

    it('it should return id subcategory does not exist', async () => {
        let data2 = { ...data };
        data2.idSubCategory =  '611c1bf8fdea6d4230c4b568';
        const response = await request(app).put(`/api/product/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('There is no subcategory with that id') // I should answer this message

    });

    it('it should return Wrong id', async () => {
        let data2 = { ...data };
        data2.idSubCategory =  '611c1bf8fdea6d4230c4b56qqwqwqweqweqweqweqwe';
        const response = await request(app).put(`/api/product/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        
        expect( response.status ).toBe(400)
        expect( response.body.message ).toEqual('Wrong id') // I should answer this message

    });

    let id3 = '6121285ad892653d8cd0b202';
    it('Should return success', async () => {
        let datasub = { ...data };
        datasub.name = 'Test by jest UPDATE';
        const response = await request(app).put(`/api/product/${ id3 }`)
                                           .send( datasub )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(200)
        expect( response.body.product ).not.toBeNull() // Do not return null the body
    });
});

// Delete product
describe('DELETE /product/{id}', () => {
    let idf = '6121210af817dd05f8386567';
    it('Product does not exists', async () => {
        const response = await request(app).delete(`/api/product/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The product does not exists') // I should answer this message
    });

    // let id= '6121210af817dd05f8386566';
    // it('Product deleted', async () => {
    //     const response = await request(app).delete(`/api/product/${ id }`)
    //                                        .set('Accept', 'application/json')
    //                                        .set('token', Admintoken);
    //     expect( response.status ).toBe(200)
    //     expect( response.body.message ).toEqual('Product deleted') // I should answer this message
    // });
});