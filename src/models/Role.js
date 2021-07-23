import { Schema, model } from 'mongoose';

const roleSchema = new Schema({
    name: String
}, {
    versionJey: false
});

export default  model('Role', roleSchema)