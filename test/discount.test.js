import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    discountCode: 'promo45',
    percentage: '45',
    startDate: '2020/12/12',
    endDate: '2021/01/12'
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDY1YjBmZmVkYWY0MzdkM2NlYzBkNSIsImlhdCI6MTYzMjAwMDgxMiwiZXhwIjoxNjMyMDg3MjEyfQ.Ktr9DoQpQrphktfvnBaVItMFxOJtFS9AOcWX6jpmCcc';
// Admin user Token
const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNDY1YjBmZmVkYWY0MzdkM2NlYzBkNSIsImlhdCI6MTYzMjAwMDgxMiwiZXhwIjoxNjMyMDg3MjEyfQ.Ktr9DoQpQrphktfvnBaVItMFxOJtFS9AOcWX6jpmCcc';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

//post
describe('POST /api/discount/store', () => { 
    
    it('It should not have a token', async () => {

        const response = await request(app).post('/api/discount/store')
                                           .send( data)
                                           .set('Accept', 'application/json');
        expect( response.status ).toBe(403)
        expect( response.body.message ).toEqual('No token provided') // I should answer this message

    });

    it('should answer with empty data', async () => {
       let data2 = { ...data };

        data2.discountCode= '';
     
        const response = await request(app).post('/api/discount/store')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
    
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    // it('It should not have a role admin or moderate', async () => {
  
    //      const response = await request(app).post('/api/discount/store')
    //                                         .send( data )
    //                                         .set('Accept', 'application/json')
    //                                         .set('token', token);
     
    //      expect( response.status ).toBe(403)
    //      expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message
 
    // });

    // it('add discount success', async () => {
  
    //     const response = await request(app).post('/api/discount/store')
    //                                        .send( data )
    //                                        .set('Accept', 'application/json')
    //                                        .set('token', Admintoken);
    
    //     expect( response.status ).toBe(201)
    // });


    it('if the discountCode is repeated', async () => {
  
        const response = await request(app).post('/api/discount/store')
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
    
        expect( response.status ).toBe(409)
    });


});

//get
describe('GET /api/discount/',() => {

    it('get discounts', async () => {
  
        const response = await request(app).get('/api/discount/')
                                           .set('token', Admintoken);

        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.discounts ) ).toBe(true);
    });

});

//get by code
describe('GET /discount/{code}', () => {

    let code = 'promo';
    it('Discount code not exist', async () => {
        const response = await request(app).get(`/api/discount/${ code }`)
                                     .set('Accept', 'application/json')
                                     .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The discount code not exists') // I should answer this message
    });

    let codet = 'promo45';
    it('Should return a discount', async () => {
        const response = await request(app).get(`/api/discount/${ codet }`)
                                     .set('Accept', 'application/json')
                                     .set('token', token);

        // expect( response.error ).toBe(true) // Exist errors
        expect( response.status ).toBe(200)
        expect( response.body.discount ).not.toBeNull() // Do not return null the body
    });
});

//update
describe('PUT /discount/{id}', () => {
    let id = '61466043c97b535173691677';
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.endDate =  'prueba';
        const response = await request(app).put(`/api/discount/${ id }`)
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    let idf = '610193e0328c4318701f82aa';
    it('Discount does not exist', async () => {
        const response = await request(app).put(`/api/discount/${ idf }`)
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The discount does not exists') // I should answer this message
    });

    let idt = '61466043c97b535173691677';
    it('Should return a discount updated', async () => {
        let endDate =  '2021/12/01';
        const response = await request(app).put(`/api/discount/${ idt }`)
                                           .send( endDate )
                                           .set('Accept', 'application/json')
                                           .set('token', token);

        expect( response.status ).toBe(200)
        expect( response.body.discount ).not.toBeNull() // Do not return null the body
    });
});

describe('DELETE /discount/{id}', () => {
    let idf = '61466043c97b535173691679';
    it('Discount does not exists', async () => {
        const response = await request(app).delete(`/api/discount/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The discount does not exists!') // I should answer this message
    });

    let id= '61466043c97b535173691677';
    it('Discount deleted', async () => {
        const response = await request(app).delete(`/api/discount/${ id }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Discount deleted!') // I should answer this message
    });
});


