import User from '../models/User';
import validator from 'validator';
import fs from 'fs';
// Import the path module
const path = require('path');

export const index = async(req, res) => {

    const users = await User.find({ status: true });

    if (!users) return res.status(200).json({ users: [] })

    // response
    res.status(200).json({ users });
}

export const show = async(req, res) => {
    const id = req.params.id;
    const userFound = await User.findById(id, { password: 0 });

    if (!userFound) return res.status(404).json({ message: 'The user does not exists' })


    res.status(200).json({ user: userFound });
}

export const updated = async(req, res) => {
    const id = req.params.id;
    const params = req.body;
    // array of validation
    const validate = [
        !validator.isEmpty(params.username), 
        !validator.isEmpty(params.email), 
        validator.isEmail(params.email)
    ];

    // validate array data and if there is incorrect data return
    if (validate.every(v => v === true)) {
        // If the data is correct, proceed to update the information
        await User.findByIdAndUpdate({ _id: id }, params, { new: true }, (err, userUp) => {
            if (err) return res.status(404).json({ message: 'The user does not exists' });
            if (!userUp) return res.status(404).json({ message: 'The user does not exists' });
    
            return res.status(200).json({ message: 'success', user: userUp });
        });
    } else {
        // return incorrect data
        res.status(200).json({ message: 'Incorrect data' });
    }

}

export const destroy = async(req, res) => {
    const id = req.params.id;

    await User.findByIdAndUpdate({ _id: id }, { status: false }, { new: true }, (err, userUp) => {
        if (err) return res.status(404).json({ message: 'The user does not exists' });
        if (!userUp) return res.status(404).json({ message: 'The user does not exists' });

        return res.status(200).json({ message: 'User deleted' });
    });
};

export const uploadImage = async(req, res) => {

    // Collect file
    if (!req.files) return res.status(404).json({ message: 'File not exists' });
    // Get extension and name
    let file_path = req.files.file0.path;
    let file_split = file_path.split('\\');
    let file_name = file_split[3];

    let ext_split = file_name.split('\.');
    let file_ext = ext_split[1];
    // Check extension ( only images), if not delete the file
    if (file_ext !== 'png' && file_ext !== 'jpg' && file_ext !== 'jpeg' && file_ext !== 'gif') {
        fs.unlink(file_path, (err) => {
            return res.status(400).json({ message: 'The file extension es not valid' });
        });
    } else {
        return res.status(200).json({ message: 'Upload Image', file: file_name });
    }

};

export const getAvatar = async(req, res) => {
    // get filename
    const file_name = req.params.filename;
    const pathFile = './src/uploads/users/' + file_name;

    if (fs.existsSync(pathFile)) {
        return res.sendFile(path.resolve(pathFile));
    }else{
        return res.status(400).json({ message: 'Avatar does not exists' });
    }
};