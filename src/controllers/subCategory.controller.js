import validator from 'validator';
import SubCategory from '../models/SubCategory';

//index
export const index = async (req, res) => {
    // Find  all subcategories
    const subCategories = await SubCategory.find({ status: true });

    if (!subCategories) return res.status(200).json({ subCategories: [] })

    // response
    res.status(200).json({ subCategories });
}

//store
export const store = async (req, res) => {
   //capture data 
    const { idCat, name } =  req.body;

    //array of validation
    const validate = [
        !validator.isEmpty( idCat ),
        !validator.isEmpty( name ),
    ];

    //validate array
    if ( validate.every(v => v === true)) {
 
        // Create the object
          const newSubCategory = new SubCategory({
            idCat,
            name,
            status: true
        });

        try {
            const savedSubCategory = await newSubCategory.save();
            // Response success
            res.status(201).json({
                message: 'Discount saved!',
                subCategory: savedSubCategory
            });
        } catch( error) {
           // Response error
            res.status(409).json({
                message: 'The subcategory already exists!'
            });
        }
    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 