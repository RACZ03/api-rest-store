import request from "supertest"
import mongoose from 'mongoose';
import config from '../src/config.js';
import app from "../src/app.js";

// Define object
const data =  {
    idProduct: '61212035b00104279cdbc445',
    idUser: '6101b566e480594c9c17109f'
};

// user token 
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMDFiNTY2ZTQ4MDU5NGM5YzE3MTA5ZiIsImlhdCI6MTYzMDAwMDQ3OCwiZXhwIjoxNjMwMDg2ODc4fQ.W4JFIOTeXmJAFcCyG0bx3h2CRFp_iH5uYmcb2phl2C4';

beforeAll( async () => {
    await mongoose.connect(config.dbURL, config.dbOptions);
})

afterAll(() => { 
    mongoose.connection.close();
})

// Test endpoint save new favorite
describe('POST /Favorite', () => { 

    
    it('should answer wrong data', async () => {
        let data2 = { ...data };
        data2.idUser =  '';
        const response = await request(app).post('/api/favorite')
                                           .send( data2 )
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        
        expect( response.status ).toBe(200)
        expect( response.body.message ).toEqual('Incorrect data') // I should answer this message

    });

    // it('Should POST a new  favorite', async () => {
    //     const response = await request(app).post('/api/favorite') //Define the end point
    //                                        .send(data)  // Object to send
    //                                        .set('Accept', 'application/json') //Headers
    //                                        .set('token', token);

    //     expect( response.status ).toBe(201)
    //     expect( response.body ).not.toBeNull() // Do not return null the body
    // } );     

});

// Test get all favorite
describe('GET ALL /favorite', () => {

    
    it('Should return favorites', async () => {
    
        const response = await request(app).get('/api/favorite/')
                                           .set('Accept', 'application/json')
                                           .set('token', token);
    
        expect( response.error ).toBe(false) // Don't exist errors
        expect( response.status ).toBe(200)
        expect( Array.isArray( response.body.favorites ) ).toBe(true); // Is an arrangement
    });

});

// Delete favorite
describe('DELETE /favorite/{id}', () => {
    let idf = '6127e8831cf984312c3a664c';
    it('Favorite does not exists', async () => {
        const response = await request(app).delete(`/api/favorite/${ idf }`)
                                           .set('Accept', 'application/json')
                                           .set('token', token);
        expect( response.status ).toBe(404)
        expect( response.body.message ).toEqual('The Favorite does not exists') // I should answer this message
    });

    // let id= '6127e8262cd3712bf066cc26';
    // it('Favorite deleted', async () => {
    //     const response = await request(app).delete(`/api/favorite/${ id }`)
    //                                        .set('Accept', 'application/json')
    //                                        .set('token', token);
    //     expect( response.status ).toBe(200)
    //     expect( response.body.message ).toEqual('Favorite deleted') // I should answer this message
    // });
});