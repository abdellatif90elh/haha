const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }

    },
    { collection: 'dbURI' }
);

const Blogg = mongoose.model('Blogg', blogSchema);

module.exports = Blogg;