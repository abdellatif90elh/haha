const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    email:{ type: String, required: true, unique:true},
    password:{ type:String, required: true}

},
{ collection:'dbURI'}
);

const Blog= mongoose.model('Blog',blogSchema);

module.exports= Blog;