const validator = require('validator');

export const signUp = (req, res) => {
    // recoger parametros de la request
    const { username, email, password, photo, phoneNumber } =  req.body;

    // validate params

    // Response
    res.status(200).json(req.body);

} 

export const signIn = (req, res) => {
    res.status(204).json(req.body);
}