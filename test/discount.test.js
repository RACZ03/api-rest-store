import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    discountCode: 'promo45',
    percentage: '45',
    startDate: '2020/12/12',
    endDate: '2021/01/12',
    status: true
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDczOGRjNDgwZmQzNGY1ZTU5OGIwZiIsImlhdCI6MTYyNzg2NTEwMywiZXhwIjoxNjI3OTUxNTAzfQ.rRnx_XsEa1W99J8nVVTVVsvku5haKpHffNBtdS8yBYY';
// Admin user Token
const Admintoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDIyMWRlZmM1MzQyMDExYzEwOWMzYSIsImlhdCI6MTYyNzUyOTY5NCwiZXhwIjoxNjI3NjE2MDk0fQ.mCB259hvMnp4OOGRxSH3nisvd1HElNMxBy7lmiV2xQU';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

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
                                           .set('token', token);
    
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });


});

