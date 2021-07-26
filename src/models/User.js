import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    idRole: { 
        ref: "Role",
        type: Schema.Types.ObjectId
    }, 
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required:  true
    },
    photo: String,
    phoneNumber: Number,
    status: Boolean
}, {
    timestamps: true,
    versionkey: false
});

export default  model('User', userSchema);