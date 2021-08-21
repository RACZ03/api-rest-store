import { Schema, model } from 'mongoose';
import Brand from './Brand';
import SubCategory from './SubCategory';


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

// Method to validate the existence of the trademark and subcategory registration
productSchema.statics.checkSubcategoryAndBrand = async (idBrand, idSubCategory) => {
    try {
        // Check brand
        const foundBrand = await Brand.findById( idBrand );
        if ( !foundBrand ) return 'There is no brand with that id';
    
        // Check subcategory
        const foundSubcategory = await SubCategory.findById( idSubCategory );
        if ( !foundSubcategory ) return 'There is no subcategory with that id';
        
        // If everything is correct, return true
        return true;
    } catch(e) {
        return 'Wrong id';
    }
}

export default  model('Product', productSchema);