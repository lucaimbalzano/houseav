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
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
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
  });
  console.log(
    formData.availabilityDateStartFrom + "-" + formData.availabilityDateEndOn
  );
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
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
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
      console.log("ERROR----------------");
      throw new Error("File exceeds maximum size (2MB)");
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
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
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
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
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
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
