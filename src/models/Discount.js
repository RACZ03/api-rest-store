import { Schema, model } from 'mongoose';

const discountSchema = new Schema({

    discountCode: {
        type: String,
        unique: true
    },
    percentage: Number,
    startDate: Date,
    endDate: Date,
    active: Boolean,
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});


export default  model('Discount', discountSchema);