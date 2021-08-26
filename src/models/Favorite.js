import { Schema, model } from 'mongoose';

const favoriteSchema = new Schema({

    idProduct: { 
        ref: "Product",
        type: Schema.Types.ObjectId
    },
    idUser: { 
        ref: "User",
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true,
    versionkey: false
});


export default  model('Favorite', favoriteSchema);