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
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyODczMzIxMCwiZXhwIjoxNjI4ODE5NjEwfQ.6o7cD4G-1tQe4n7DucrPLmoF-OqRBYC4FGbG8b5ws2c';
// Admin user Token
const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyODczMzIxMCwiZXhwIjoxNjI4ODE5NjEwfQ.6o7cD4G-1tQe4n7DucrPLmoF-OqRBYC4FGbG8b5ws2c';

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

    it('It should not have a role admin or moderate', async () => {
  
         const response = await request(app).post('/api/discount/store')
                                            .send( data )
                                            .set('Accept', 'application/json')
                                            .set('token', token);
     
         expect( response.status ).toBe(403)
         expect( response.body.message ).toEqual('Requires moderator or administrator role') // I should answer this message
 
    });

    it('add discount success', async () => {
  
        const response = await request(app).post('/api/discount/store')
                                           .send( data )
                                           .set('Accept', 'application/json')
                                           .set('token', Admintoken);
    
        expect( response.status ).toBe(201)
    });


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

