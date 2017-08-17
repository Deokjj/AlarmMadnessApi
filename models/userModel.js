const mongoose = require("mongoose");

const UserModel = mongoose.model(
  "User",               // 1st arg - Model name
  new mongoose.Schema(  // 2nd arg - schema object

    { //1st arg - structure object

      name: {
        type:String,
        require: true
      },
      encryptedPassword : {
        type:String,
        required:true
      },
      photoUrl:{
        type:String,
        default:''
      },
      emotionWhenJoined:{
        type:String,
        default: ''
      },
      currentAlarm: [

        {
          timeSet:{
            type: String
          },
          alarmCreatedAt:{
            type: String
          },
          soundSet:{
            title:{type: String},
            id:{type: String}
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

module.exports = UserModel;
