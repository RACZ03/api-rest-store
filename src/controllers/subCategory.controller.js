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

// Subcategory found
export const show = async (req, res) => {
    const id = req.params.id;
    const subCategoryFound = await SubCategory.findOne({ _id: id, status: true });

    if (!subCategoryFound) return res.status(404).json({ message: 'The subcategory does not exists' })


    res.status(200).json({ subcategory: subCategoryFound });
};

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

// Udate data subcategory
export  const update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;
    // array of validation
    const validate = [
        !validator.isEmpty(params.idCat), 
        !validator.isEmpty(params.name)
    ];

    // validate array data and if there is incorrect data return
    if (validate.every(v => v === true)) {
        // If the data is correct, proceed to update the information
        await SubCategory.findByIdAndUpdate({ _id: id, status: true }, params, { new: true }, (err, subCategoryUp) => {
            if (err) return res.status(404).json({ message: 'The subcategory does not exists' });
            if (!subCategoryUp) return res.status(404).json({ message: 'The subcategory does not exists' });
    
            return res.status(200).json({ message: 'success', subCategory: subCategoryUp });
        });
    } else {
        // return incorrect data
        res.status(200).json({ message: 'Incorrect data' });
    }
}

// delete subcategory
export const destroy = async (req, res) => {
    const id = req.params.id;

    // found subcategory and update status
    await SubCategory.findByIdAndUpdate({ _id: id, status: true }, { status: false }, { new: true }, (err, subCategoryUp) => {
        if (err) return res.status(404).json({ message: 'The Subcategory does not exists' });
        if (!subCategoryUp) return res.status(404).json({ message: 'The Subcategory does not exists' });

        return res.status(200).json({ message: 'Subcategory deleted' });
    });
};