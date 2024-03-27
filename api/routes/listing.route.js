import express from 'express';
import { createListing, deleteListing, updateListing, getListing,getListingsBySearch, getListings, deleteAllListing } from '../controller/listing.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';


const listingRouter = express.Router();

listingRouter.post('/create', verifyUserToken, createListing);
listingRouter.delete('/delete/:id', verifyUserToken, deleteListing);
listingRouter.post('/update/:id', verifyUserToken, updateListing);
listingRouter.get('/get/:id', getListing);
listingRouter.get('/get', getListingsBySearch);
listingRouter.get('/get-all/', getListings)
listingRouter.delete('/delete-all', deleteAllListing)

export default listingRouter;