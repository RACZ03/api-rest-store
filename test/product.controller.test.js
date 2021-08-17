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