import { Schema, model } from 'mongoose';

const discountSchema = new Schema({

    discountCode: {
        type: String,
        unique: true
    },
    percentage: String,
    startDate: Date,
    endDate: Date,
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});


export default  model('Discount', discountSchema);