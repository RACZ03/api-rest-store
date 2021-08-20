import { Schema, model } from 'mongoose';

const productSchema = new Schema({

    idSubCategory: { 
        ref: "SubCategory",
        type: Schema.Types.ObjectId
    },
    idBrand: { 
        ref: "Brand",
        type: Schema.Types.ObjectId
    },
    idUser: { 
        ref: "User",
        type: Schema.Types.ObjectId
    }, 
    name: String,
    description: String,
    price: Number,
    discount: Number,
    stoke: Number,
    photos: [],
    clasifications: [],
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});


export default  model('Product', productSchema);