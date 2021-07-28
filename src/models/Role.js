import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
    name: String
}, {
    versionkey: false
});

export default  model('Role', roleSchema)