import validator from 'validator';
import Brand from '../models/Brand';

//index
export const index = async (req, res) => {
    // Find  all subcategories
    const brands = await Brand.find({ status: true });

    if (!brands) return res.status(200).json({ brands: [] })

    // response
    res.status(200).json({ brands });
}

// Brand found
export const show = async (req, res) => {
    const id = req.params.id;
    const brandFound = await Brand.findOne({ _id: id, status: true });

    console.log(id)
    if (!brandFound) return res.status(404).json({ message: 'The Brand does not exists' })


    res.status(200).json({ brand: brandFound });
};

//store
export const store = async (req, res) => {
   //capture data 
    const { name } =  req.body;

    //array of validation
    const validate = [
        !validator.isEmpty( name )
    ];

    //validate array
    if ( validate.every(v => v === true)) {
 
        // Create the object
          const newBrand = new Brand({
            name,
            status: true
        });

        try {
            const savedBrand = await newBrand.save();
            // Response success
            res.status(201).json({
                message: 'Brand saved!',
                brand: savedBrand
            });
        } catch( error) {
           // Response error
            res.status(409).json({
                message: 'The brand already exists!'
            });
        }
    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
} 

// Udate data brand
export  const update = async (req, res) => {
    const id = req.params.id;
    const params = req.body;
    // array of validation
    const validate = [
        !validator.isEmpty(params.name)
    ];

    // validate array data and if there is incorrect data return
    if (validate.every(v => v === true)) {
        // If the data is correct, proceed to update the information
        await Brand.findByIdAndUpdate({ _id: id, status: true }, params, { new: true }, (err, brandUp) => {
            if (err) return res.status(404).json({ message: 'The brand does not exists' });
            if (!brandUp) return res.status(404).json({ message: 'The brand does not exists' });
    
            return res.status(200).json({ message: 'success', brand: brandUp });
        });
    } else {
        // return incorrect data
        res.status(200).json({ message: 'Incorrect data' });
    }
}

// delete brand
export const destroy = async (req, res) => {
    const id = req.params.id;

    // found subcategory and update status
    await Brand.findByIdAndUpdate({ _id: id, status: true }, { status: false }, { new: true }, (err, brandUp) => {
        if (err) return res.status(404).json({ message: 'The brand does not exists' });
        if (!brandUp) return res.status(404).json({ message: 'The brand does not exists' });

        return res.status(200).json({ message: 'Brand deleted' });
    });
};