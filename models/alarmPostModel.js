const mongoose = require("mongoose");

const AlarmPostModel = mongoose.model(
  "AlarmPost",               // 1st arg - Model name
  new mongoose.Schema(  // 2nd arg - schema object

    { //1st arg - structure object
      timeSet: {
        type: String,
        default: ''
      },
      alarmCreatedAt : {
        type: String,
        default:''
      },
      userId:{
        type: mongoose.Schema.Types.ObjectId,
        // type: String,
        required: true,
        ref:'User'
      },
      userName:{
        type: String,
        required: true
      },
      emoji:{
        type: String,
        required: true
      },
      photoUrl:{
        type:String,
        required: true
      },
      soundSet:{
        title: {
          type: String,
          default:''
        },
        id: {
          type: String,
          default:''
        }
      },
      comments: [
        {
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref:'User'
          },
          userName:{
            type: String
          },
          photoUrl:{
            type: String
          },
          comment: {
            type: String
          },
          _id: {
            type: String
          },
          createdAt:{
            type: Date
          }
        },
      ]

    },
    { //2nd arg - optional
      timestamps: true
      //creates "createdAt" & "updatedAt"
    }
  )
);

module.exports = AlarmPostModel;
