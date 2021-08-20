import Product from '../models/Product';
import validator from 'validator';
import fs from 'fs';
// Import the path module
const path = require('path');

export const index = async(req, res) => {

    /// Find  all subcategories
    const products = await Product.find({ status: true });

    if (!products) return res.status(200).json({ products: [] })

    // response
    res.status(200).json({ products });
}

export const show = async(req, res) => {

    const id = req.params.id;
    const productFound = await Product.findOne({ _id: id, status: true });

    if (!productFound) return res.status(404).json({ message: 'The product does not exists' })


    res.status(200).json({ product: productFound });
}

export const store = async(req, res) => {

    //capture data 
    const { idSubCategory, idBrand, idUser, name, description, price, discount, stoke, photos, clasifications } =  req.body;

    //array of validation
    const validate = [
        !validator.isEmpty( idSubCategory ),
        !validator.isEmpty( idBrand ),
        !validator.isEmpty( idUser ),
        !validator.isEmpty( name ),
        !validator.isEmpty( description ),
        await isNumeric(price),
        await isNumeric(stoke),
        !validator.isEmpty( photos )
    ];

    //validate array
    if ( validate.every(v => v === true)) {
   
        // Create the object
        const newProduct = new Product({
           idSubCategory,
           idBrand,
           idUser,
           name,
           description,
           price,
           discount,
           stoke,
           photos,
           clasifications,
           status: true
       });
   
       try {
   
           const savedProduct = await newProduct.save();
   
           // Response success
           res.status(201).json({
               message: 'Producto saved!',
               product: savedProduct
           });
       } catch( error) {
          // Response error
           res.status(409).json({
               message: 'Save failed'
           });
       }
    } else {
        //Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
}

export const update = async(req, res) => {

    return res.status(200).json({ message: 'success' });

}

export const destroy = async(req, res) => {
    const id = req.params.id;

    // found product and update status
    await Product.findByIdAndUpdate({ _id: id, status: true }, { status: false }, { new: true }, (err, subCategoryUp) => {
        if (err) return res.status(404).json({ message: 'The product does not exists' });
        if (!subCategoryUp) return res.status(404).json({ message: 'The product does not exists' });

        return res.status(200).json({ message: 'Product deleted' });
    });
};


export const getImage = async(req, res) => {
    // get filename
    const file_name = req.params.filename;
    const pathFile = './src/uploads/products/' + file_name;

    if (fs.existsSync(pathFile)) {
        return res.sendFile(path.resolve(pathFile));
    }else{
        return res.status(400).json({ message: 'Avatar does not exists' });
    }
};