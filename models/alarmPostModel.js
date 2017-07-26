const mongoose = require("mongoose");

const AlarmPostModel = mongoose.model(
  "AlarmPost",               // 1st arg - Model name
  new mongoose.Schema(  // 2nd arg - schema object

    { //1st arg - structure object
      timeSet: {
        type:Date,
        require: true
      },
      alarmCreatedAt : {
        type:Date,
        required:true
      },
      user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
      },
      base64:[
        {
          type:String,
          default: ''
        }
      ],
      photoUrl:[
        {
          type:String,
          default: ''
        }
      ],
      youtubeUrl:{
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
