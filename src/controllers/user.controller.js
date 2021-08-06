import User from '../models/User';
import validator from 'validator';
import fs from 'fs';
import { path } from 'path';

export const index = async (req, res) => {

    const users = await User.find({});

    if ( !users ) return res.status(200).json({ users: [] })

    // response
    res.status(200).json({ users } );
}

export const show = async (req, res) => {
    const id = req.params.id;
    const userFound = await User.findById( id, { password: 0 } );

    if ( !userFound ) return res.status(404).json({ message: 'The user does not exists'})

    
    res.status(200).json({ user: userFound } );
}

export const updated = async (req, res) => {
    const id = req.params.id;
    const params =  req.body;
    
    // validate data
    let validate_username = !validator.isEmpty( params.username );
    let validate_email = !validator.isEmpty( params.email ) && validator.isEmail( params.email );
    
    if ( validate_username && validate_email ) {

        await User.findByIdAndUpdate( { _id: id }, params, { new:true }, (err, userUp) => {
            if ( err ) return res.status(404).json({ message: 'The user does not exists'});
            if ( !userUp ) return res.status(200).json({ message: 'The update was not carried out'});

            return res.status(200).json( { message: 'success', user: userUp } );
        });
    } else {
        // Incorrect data
        res.status(200).json({
            message: 'Incorrect data'
        });
    }
}

export const destroy = async (req, res) => {
    const id = req.params.id;

    await User.findByIdAndUpdate( { _id: id }, { status: false}, { new:true }, (err, userUp) => {
        if ( err ) return res.status(404).json({ message: 'The user does not exists'});
        if ( !userUp ) return res.status(404).json({ message: 'The user does not exists'});

        return res.status(200).json( { message: 'User deleted' } );
    });
};

export const uploadImage = async (req, res) => {

    // Collect file
    if ( !req.files ) return res.status(404).json({ message: 'File not exists'});
    // Get extension and name
    let file_path = req.files.file0.path;
    let file_split = file_path.split('\\');
    let file_name = file_split[3];

    let ext_split = file_name.split('\.');
    let file_ext = ext_split[1];
    // Check extension ( only images), if not delete the file
    if ( file_ext !== 'png' && file_ext !== 'jpg' && file_ext !== 'jpeg' && file_ext !== 'gif' ) {
        fs.unlink( file_path, (err) => {
            return res.status(400).json({ message: 'The file extension es not valid'});
        });
    } else {
        return res.status(200).json( { message: 'Upload Image', file: file_name } );
    }

};