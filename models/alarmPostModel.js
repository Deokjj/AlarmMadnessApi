const mongoose = require("mongoose");

const AlarmPostModel = mongoose.model(
  "AlarmPost",               // 1st arg - Model name
  new mongoose.Schema(  // 2nd arg - schema object

    { //1st arg - structure object
      timeSet: {
        type: String,
        require: true
      },
      alarmCreatedAt : {
        type: String,
        required:true
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
      },
      photoUrl:{
        type:String,
        default: ''
      },
      youtubeKey:{
        type:String,
        default: ''
      },
      comments: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
          },
          comment: {
            type: String
          }

        }
      ]

    },
    { //2nd arg - optional
      timestamps: true
      //creates "createdAt" & "updatedAt"
    }
  )
);

module.exports = AlarmPostModel;
