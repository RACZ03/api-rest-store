import { Schema, model } from 'mongoose';

const configSchema = new Schema({ 
    name: {
        type: String,
        unique: true
    },
    description: String,
    email: {
        type: String,
        unique: true
    },
    location: String,
    phoneNumber: Number,
    currency: String,
    symbol: String,
    changeType: Number,
    freeShipping: Boolean,
    privacyPol: String,
    termsAndCond: String,
    questionsAndAns: String,
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});

export default  model('Config', configSchema);
