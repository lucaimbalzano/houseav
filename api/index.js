import express from 'express';
import mongoose  from 'mongoose';
import userRouter from './routes/user.route.js';
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log('mongodb connected')
}).catch((err) => console.log(err));

const app = express();
app.listen(3000,()=>{
    console.log('server on 30ds00dcsd@!')
});

app.use("/api/user", userRouter);