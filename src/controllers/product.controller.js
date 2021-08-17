import Product from '../models/Product';
import validator from 'validator';
import fs from 'fs';
// Import the path module
const path = require('path');

export const index = async(req, res) => {

    const products = [];

    // response
    res.status(200).json({ products });
}

export const show = async(req, res) => {

    res.status(200).json({ user: [] });
}

export const updated = async(req, res) => {

    return res.status(200).json({ message: 'success' });

}

export const destroy = async(req, res) => {
    return res.status(200).json({ message: 'User deleted' });
};

export const uploadImage = async(req, res) => {

    // Collect file
    //if (!req.files) return res.status(404).json({ message: 'File not exists' });
    // Get extension and name
    //let file_path = req.files.file0.path;
   /// let file_split = file_path.split('\\');
   // let file_name = file_split[3];

   // let ext_split = file_name.split('\.');
   // let file_ext = ext_split[1];
    // Check extension ( only images), if not delete the file
  //  if (file_ext !== 'png' && file_ext !== 'jpg' && file_ext !== 'jpeg' && file_ext !== 'gif') {
     //   fs.unlink(file_path, (err) => {
   //         return res.status(400).json({ message: 'The file extension es not valid' });
   //     });
   // } else {
  //      return res.status(200).json({ message: 'Upload Image', file: file_name });
   // }

    return res.status(200).json({ message: 'Upload Image'});

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