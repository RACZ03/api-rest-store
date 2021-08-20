import { Schema, model } from 'mongoose';

const brandSchema = new Schema({ 
    name: {
        type: String,
        unique: true
    },
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});

export default  model('Brand', brandSchema);