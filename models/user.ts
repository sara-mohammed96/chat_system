import mongoose,{ Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    email:{
        type: String,
        unique: true,
        required: [true, 'Please provide your email'],
      //  match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    name: {
        type: String,
        required: [true],
       // minLength: [4, "Full name should be at least 4 characters"],
       // maxLength: [30, "Full name should be less than 30 characters"],
    },
},
{ timestamps: true}
);

const User = models.User || mongoose.model("User", UserSchema)

export default User