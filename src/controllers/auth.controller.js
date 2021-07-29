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

        res.status(201).json( token );

    } else {
        // Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 

export const signIn = async (req, res) => {

    const { email, password } = req.body;
    const userFound = await User.findOne({'email': email}).populate("idRole"); 

    // Incorrect data
    if ( !userFound ) return res.status(200).json({ message: 'User not found' });

    const matchPassword = await User.comparePassword( password, userFound.password );
    
    if ( !matchPassword ) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
        expiresIn: 86400 // 24 Hours
    });

    res.status(200).json( { token } );
}