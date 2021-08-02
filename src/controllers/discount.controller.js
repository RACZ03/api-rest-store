import validator from 'validator';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config';

export const store = async (req, res) => {
   //capture data 
    const { discountCode, percentage, startDate, endDate } =  req.body;

    //validate data
    let validate_discountCode = !validator.isEmpty( discountCode );
    let validate_percentage = !validator.isNumeric( percentage );
    let validate_startDate = !validator.isEmpty( startDate );
    let validate_endDate = !validator.isEmpty( endDate );

    if ( validate_discountCode  && validate_percentage  && validate_startDate && validate_endDate) {

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
        // Response success
        const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
            expiresIn: 86400 // 24 Hours
        });

        res.status(201).json( token );

    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 