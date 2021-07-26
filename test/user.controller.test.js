const { signUp } = require('../src/controllers/auth.controller.js');

// Defining user controller unit tests
describe('User controller', () => {
    test('Check if it is an email', () => {
        const exprected = 'rmorck03@gmail.com';
        const result = signUp('rmorck03@gmail.com')

        exprected( exprected ).toBe( result );
    })
});