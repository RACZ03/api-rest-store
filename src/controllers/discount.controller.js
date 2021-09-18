import validator from 'validator';
import Discount from '../models/Discount';
import {isNumeric} from '../helpers/isNumeric';

//index
export const index = async (req, res) => {
    //data
    const discounts = await Discount.find({});
    //filter
    const discountsFiltered = await discounts.filter( 
        discount => discount.status === true
    );

    if ( !discountsFiltered ) return res.status(204).json({
       discounts: [] 
    })

    // response
    res.status(200).json({ discounts: discountsFiltered } );
}

//show by code
export const show = async(req, res) => {
    const code = req.params.code;
    const discountFound = await Discount.findOne({ discountCode: code, status: true });;

    if (!discountFound) return res.status(404).json({ message: 'The discount code not exists' })


    res.status(200).json({ discount: discountFound });
}

//store
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
            message: 'DiscountCode must be unique, discountCode: ' +discountCode+ ' is already used!'
        });
    }
    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 