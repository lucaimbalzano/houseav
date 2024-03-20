import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { firebaseApp } from "../firebase";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [fileProgression, setFileProgression] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formDataUserUpdate, setFormDataUserUpdate] = useState({});

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(firebaseApp);
    const filenameOfNewEntry = new Date().getTime() + file.name;
    const storageRef = ref(storage, filenameOfNewEntry);
    const uploadTask = uploadBytesResumable(storageRef, file); //progess watch

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgression(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
        console.log(error.message);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormDataUserUpdate({ ...formDataUserUpdate, avatar: downloadUrl });
        });
      }
    );
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(event) => setFile(event.target.files[0])}
        />
        <img
          src={formDataUserUpdate.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileProgression > 0 && fileProgression < 100 ? (
            <span className="text-slate-400">{`Uploading ${fileProgression}%`}</span>
          ) : fileProgression === 100 ? (
            <span className="text-blue-300">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          defaultValue={currentUser.email}
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          Update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-blue-500 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}
