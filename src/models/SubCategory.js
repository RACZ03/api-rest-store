import { Schema, model } from 'mongoose';

const subCategorySchema = new Schema({
    idCat: { 
        ref: "Category",
        type: Schema.Types.ObjectId
    }, 
    name: {
        type: String,
        unique: true
    },
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});

export default  model('SubCategory', subCategorySchema)