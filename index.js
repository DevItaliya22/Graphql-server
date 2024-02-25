import {mongoose} from "mongoose";
import express from "express";
import { ApolloServer } from "@apollo/server";
import {  expressMiddleware } from "@apollo/server/express4";
import cors from 'cors';
import bodyParser from 'body-parser';
import {User,Course} from './db.js'

const typeDefs = `
    type Course {
        _id: ID
        title: String
        price: String
    }

    type User {
        _id: ID
        email: String
        password: String
        coursesBought: [Course]
        coursesSold: [Course]
    }

    type Query {
        getUsers: [User]
        getCourses: [Course]
        getUserById(_id : ID!) : User
    }
    input courseInput{
        title:String!
        price:String!
    }
    input userInput{
        email:String!
        password:String!
    }
    type Mutation{
        createCourse(input:courseInput) : Course!
        createUser(input:userInput) :User!
    }
`;

const resolvers = {
    Query:{
        getUsers : async ()=>{
            const users = await User.find()
            console.log(users)
            return users
        },
        getCourses : async ()=>{
            const course = await Course.find();
            console.log(course);
            return course
        },
        getUserById : async (_,{_id})=>{
            const user = await User.findOne({_id:_id})
            console.log(user);
            return user
        }

    },
    User : {
        coursesBought : async(user)=>{
            const ans=[]
            
            for(let i=0;i<user.coursesBought.length ;i++)
            {
                const x = await Course.findOne({_id:user.coursesBought[i]._id})
                ans.push(x)
            }
            return ans;

        }
    },
    Mutation : {
        createCourse : async(parent , {input}) => {
            const { title , price } = input
            const course = await Course.create({title,price})
            return course
        },
        createUser : async(_,{input})=>{
            const {email,password} = input
            const user =await User.create({email,password})
            return user
        }

    }
    

};





const startServer = async () => {
    const app = express();

    //mongo-db connections
    await mongoose.connect('mongodb://localhost:27017/courses');

    //starting graph ql server 
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();
    
    //middlewares
    app.use(cors());
    app.use(bodyParser.json());
    app.use("/graphql",expressMiddleware(server))

    //routes
    app.get("/",(req,res)=>{
        res.json({"message":"Server started"})
    })
    app.listen(3000, () => {
        console.log("Graphql server started on port 3000");
    });
};
startServer();
