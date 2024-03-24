import express from 'express';
import { createListing, deleteListing, updateListing, getListing } from '../controller/listing.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';


const listingRouter = express.Router();

listingRouter.post('/create', verifyUserToken, createListing);
listingRouter.delete('/delete/:id', verifyUserToken, deleteListing);
listingRouter.post('/update/:id', verifyUserToken, updateListing);
listingRouter.get('/get/:id', getListing);

export default listingRouter;