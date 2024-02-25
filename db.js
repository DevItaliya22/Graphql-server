import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    coursesBought: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    }],
    coursesSold: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses'
    }]
});

const coursesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema); 
const Course = mongoose.model('Courses', coursesSchema);

export{
    User,
    Course
}
