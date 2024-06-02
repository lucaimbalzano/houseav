import React, { useState } from "react";
import { firebaseApp } from "../firebase.js";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RiUploadCloud2Fill } from "react-icons/ri";
import { LuCopyPlus } from "react-icons/lu";
import Spinner from "../components/Spinner.jsx";

export default function CreateListing() {
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  var currentTime = new Date().getTime();
  var oneWeek = 7 * 24 * 60 * 60 * 1000;
  var currentTimePlusWeek = currentTime + oneWeek;
  const [formData, setFormData] = useState({
    imageUrls: "",
    title: "",
    description: "",
    address: "",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    wifi: false,
    parking: false,
    furnished: false,
    availability: true,
    availabilityDateStartFrom: new Date(currentTime)
      .toISOString()
      .split("T")[0],
    availabilityDateEndOn: new Date(currentTimePlusWeek)
      .toISOString()
      .split("T")[0],
    sleepPlace: 1,
    allergy: "",
    animals:"",
    requestRoommateType: "Any",
    transportation: "",
    zone: "",
  });




  const handleChange = (event) => {
    if (
      event.target.id === "parking" ||
      event.target.id === "furnished" ||
      event.target.id === "wifi"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.checked,
      });
    }

    if (
      event.target.type === "text" ||
      event.target.type === "textarea" ||
      event.target.type === "number" ||
      event.target.type === "date"
    ) {
      setFormData({
        ...formData,
        [event.target.id]: event.target.value,
      });
    }
  };
  const handleImageSubmit = (event) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImageUrls(files[i]));
      }

      // I use Proimise because i have multiple asynchronous operations that can be executed concurrently, i wait all of them to complete before continuing.
      Promise.all(promises)
      .then((urls) => {
        const existingUrls = formData.imageUrls ? formData.imageUrls.split(';') : [];
        const allUrls = existingUrls.concat(urls);
        const concatenatedUrls = allUrls.join(';');
        
        setFormData({
          ...formData,
          imageUrls: concatenatedUrls,
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setImageUploadError("Image upload failed (2 mb max per image)");
        setUploading(false);
      });
    
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImageUrls = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Error Occurred: File exceeds maximum size (2MB)");
    }
    return new Promise((resolve, reject) => {
      const storage = getStorage(firebaseApp);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter(
        (item, indexUrls) => indexUrls != index
      ),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch("/house", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${currentUser.access_token}`
        },
        body: JSON.stringify({
          ...formData,
          userId: currentUser.user.id,
        }),
      });
      setLoading(false);
      const acceptableStatusCodes = [200, 201, 202];
      if (!acceptableStatusCodes.includes(res.status)) {
        setError("Error while adding this listing");
      }
      const data = await res.json();
      navigate(`/listing/${data.id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold my-7 flex items-center gap-2 justify-center">
        <LuCopyPlus />
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Title"
            className="border p-3 rounded-lg"
            id="title"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.title}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <label>Date</label>
          <label className="text-gray-400 text-xs text-end pr-5">start</label>
          <input
            type="date"
            placeholder="Date Start From"
            className="border p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out bg-gradient-to-br from-gray-200 to-gray-100 hover:to-gray-50"
            id="availabilityDateStartFrom"
            required
            onChange={handleChange}
            value={formData.availabilityDateStartFrom}
          />
          <label className="text-gray-400 text-xs text-end pr-5">to</label>
          <input
            type="date"
            placeholder="Date end to"
            className="border p-3 rounded-lg focus:outline-none focus:ring focus:border-blue-300 transition duration-300 ease-in-out bg-gradient-to-br from-gray-200 to-gray-100 hover:to-gray-50"
            id="availabilityDateEndOn"
            required
            onChange={handleChange}
            value={formData.availabilityDateEndOn}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="wifi"
                className="w-5"
                onChange={handleChange}
                checked={formData.wifi}
              />
              <span>wifi</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="availability"
                className="w-5"
                onChange={handleChange}
                checked={formData.availability}
              />
              <span>Availability</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="0"
                max="100"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="sleepPlace"
                min="1"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.sleepPlace}
              />
              <div className="flex flex-col items-center">
                <p>Sleep Place</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 items-center">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 rounded-lg w-full bg-white bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out
              
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-900 file:text-gray-50
              hover:file:bg-gray-700 hover:file:scale-105 hover:file:shadow-md"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="h-[70%] pr-3 pl-3 text-blue-700 border border-blue-700 rounded-lg hover:shadow-lg disabled:opacity-80 flex gap-2 items-center bg-slate-100"
            >
              <RiUploadCloud2Fill className="text-2xl" />
              {/* {uploading ? <Spinner /> : "Upload"} */}
              {uploading ? (
                <>
                  <p>Uploading</p>
                </>
              ) : (
                "Upload"
              )}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.split(";").map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-40 h-40 sm:w-20 sm:h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
              <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Allergy"
            className="border p-3 rounded-lg"
            id="allergy"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.allergy}
          />
                  <input
            type="text"
            placeholder="Animals"
            className="border p-3 rounded-lg"
            id="animals"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.animals}
          />
                            <input
            type="text"
            placeholder="Roommate Type"
            className="border p-3 rounded-lg"
            id="requestRoommateType"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.requestRoommateType}
          />
                                      <input
            type="text"
            placeholder="Transportation"
            className="border p-3 rounded-lg"
            id="transportation"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.transportation}
          />
          </div>


          <button
            disabled={loading || uploading}
            className="w-full text-center mt-4 justify-center text-gray-900 font-semibold py-3 px-6 bg-gray-400 bg-opacity-50 rounded-lg shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center gap-3"
          >
            {loading ? <Spinner /> : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
