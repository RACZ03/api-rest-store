import validator from 'validator';
import Discount from '../models/Discount';
import {isNumeric} from '../helpers/isNumeric';

export const store = async (req, res) => {
   //capture data 
    const { discountCode, percentage, startDate, endDate } =  req.body;

    //array of validation
    const validate = [
        !validator.isEmpty( discountCode ),
        await isNumeric(percentage),
        !validator.isEmpty( startDate ),
        !validator.isEmpty( endDate ),
    ];

    //validate array
    if ( validate.every(v => v === true)) {

      // Create the object
      const newDiscount = new Discount({
        discountCode,
        percentage,
        startDate,
        endDate,
        active: false,
        status: true
    });

    try {

        const savedDiscount = await newDiscount.save();

        // Response success
        res.status(201).json({
            message: 'Discount saved!',
            discount: savedDiscount
        });
    } catch( error) {
       // Response error
        res.status(409).json({
            message: 'DiscountCode must be unique, discountCode:'+error.keyValue.discountCode+ ' is already used!'
        });
    }
    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 