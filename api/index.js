import express from 'express';
import mongoose  from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();


mongoose.connect(process.env.MONGO).then(()=>{
    console.log('[connection] mongodb connected')
}).catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('[connection] server listen on 3K')
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})