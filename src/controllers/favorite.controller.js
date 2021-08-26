import validator from 'validator';
import Favorite from '../models/Favorite';

//index
export const index = async (req, res) => {
    // Find  all subcategories
    const favorites = await Favorite.find();

    if (!favorites) return res.status(200).json({ favorites: [] })

    // response
    res.status(200).json({ favorites });
}

//store
export const store = async (req, res) => {
   //capture data 
    const { idProduct, idUser } =  req.body;

    //array of validation
    const validate = [
        !validator.isEmpty( idProduct ),
        !validator.isEmpty( idUser )
    ];

    //validate array
    if ( validate.every(v => v === true)) {
 
        // Create the object
          const newFavorite = new Favorite({
            idProduct,
            idUser
        });

        try {
            const savedFavorite= await newFavorite.save();
            // Response success
            res.status(201).json({
                message: 'Favorite saved!',
                brand: savedFavorite
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

// delete favorite
export const destroy = async (req, res) => {
    const id = req.params.id;

    try {
        // found favorite and update status
        const foundFavorite = await Favorite.findOne({ _id: id });
        console.log(foundFavorite)
        if (!foundFavorite) return res.status(404).json({ message: 'The Favorite does not exists' })

        foundFavorite.remove();
        return res.status(200).json({ message: 'Favorite deleted' });
    } catch (error) {
        //Error
        res.status(404).json({
            message: 'Delete failed'
        });
    }


};