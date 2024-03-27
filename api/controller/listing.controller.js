import Listing from "../models/listing.model.js"
import { errorHandler } from "../utils/error.js";
import mongoose  from 'mongoose';
import findByIdChecked from "./utils.js";


export const createListing = async (req, res, next) => {
    try {
      const listing = await Listing.create(req.body);
      return res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  };

export const getListing = async (req, res, next) => {
  try {
    const listing = await findByIdChecked(Listing,req.params.id, next);    
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};


export const deleteListing = async (req, res, next) => {
  const listing = await findByIdChecked(Listing,req.params.id,next)
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const deleteAllListing = async (req, res, next) => {
  try {
    await Listing.deleteMany({}); 
    res.status(200).json('All listings have been deleted!');
  } catch (error) {
    next(error);
  }
};


export const updateListing = async (req, res, next) => {
  try {
    const listing = await findByIdChecked(Listing,req.params.id, next); 
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } //tells MongoDB to return the modified document rather than the original one
    );
    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};


export const getListingsBySearch = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let wifi = req.query.wifi;

    if (wifi === undefined || wifi === 'false') {
      wifi = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type; // Type house -> apartment, house..

    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: 'i' },
      wifi,
      furnished,
      parking,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    
    if(!listings) next(errorHandler(404, 'Listings not found!'))
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}


export const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({});
    if(!listings) next(errorHandler(404, 'Listings not found!'))
    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }

}