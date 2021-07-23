import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required:  true
    },
    roles: [{ 
        ref: "Role",
        type: Schema.Types.ObjectId
    }]
}, {
    timestamps: true,
    versionkey: false
});

export default  model('User',userSchema)