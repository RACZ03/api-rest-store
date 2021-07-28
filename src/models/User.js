import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs'
import Role from './Role';

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

// Static: Define a method without having to instantiate them
userSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password,  salt);
}

userSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);
}

userSchema.statics.assignRole = async () => {
    const foundRole = await Role.findOne({ 'name': 'user' })
    return foundRole._id;
}

export default  model('User', userSchema);