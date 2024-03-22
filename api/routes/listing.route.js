import express from 'express';
import { createListing } from '../controller/listing.controller.js';
import { verifyUserToken } from '../utils/verifyUser.js';

const listingRouter = express.Router();

listingRouter.post('/create', verifyUserToken, createListing);

export default listingRouter;