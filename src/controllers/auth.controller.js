import validator from 'validator';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

export const signUp = async (req, res) => {
    // capture data 
    const { username, email, password, photo, phoneNumber } =  req.body;

    // validate data
    let validate_username = !validator.isEmpty( username );
    let validate_email = !validator.isEmpty( email ) && validator.isEmail( email );
    let validate_password = !validator.isEmpty( password );

    if ( validate_username && validate_email && validate_password ) {

        // Create the object
        const newUser = new User({
            username,
            email,
            photo,
            password: await User.encryptPassword( password ),
            idRole: await User.assignRole(),
            phoneNumber: phoneNumber
        });

        const savedUser = await newUser.save();
        // // Response success
        const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 86400 // 24 Hours
        });

        res.status(201).json( newUser );

    } else {
        // Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 

export const signIn = async (req, res) => {

    const { email } = req.body;
    const foundUser = await User.findOne({'email': email}); 

    if ( !foundUser ) {
        // Incorrect data
        res.status(200).json({
            message: 'User not found'
        });
        return;
    }

    res.status(201).json( req.body );
}