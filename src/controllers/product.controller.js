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

    res.status(200).json({ message: 'success' });
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