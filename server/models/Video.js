const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({

    writer : {
        type : Schema.Types.ObjectId,
    },
    title : {
        type : String,
        maxlength : 50
    },
    category : {
        type : String,
    },
    views : {
        type : Number,
        default : 0
    },
    duration : {
        type : String,
    },
    thumbnail : {
        type : String
    }

}, { thimstamps : true})


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }