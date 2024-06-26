import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
  } from "firebase/storage";
import { firebaseApp } from "../../firebase";
import {
  deleteUserFailure,
  deleteUserSuccess,
  deleteUserStart,
  signOutUserFailure,
  signOutUserSuccess,
  signOutUserStart,
} from "../../redux/user/userSlice";


export const handleFileUploadLogic = async (file, setFileProgression, setFileUploadError, setFormDataUserUpdate, formDataUserUpdate) => {
    const storage = getStorage(firebaseApp);
    const filenameOfNewEntry = new Date().getTime() + file.name;
    const storageRef = ref(storage, filenameOfNewEntry);
    const uploadTask = uploadBytesResumable(storageRef, file); //progress watch

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileProgression(Math.round(progress));
      },

      (error) => {
        setFileUploadError(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormDataUserUpdate({ ...formDataUserUpdate, avatar: downloadUrl });
        });
      }
    );
  };
  
export  const handleShowListingsLogic = async (id, setShowListingsError, setUserListings) => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  

export const handleSignOutLogic = async (dispatch) => {
  try {
    dispatch(signOutUserStart());
    const res = await fetch("/api/auth/signout");
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(signOutUserSuccess(data));
  } catch (error) {
    dispatch(signOutUserFailure(error.message));
  }
}


export const handleDeleteUserLogic = async (dispatch, currentUser) => {
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success === false) {
      dispatch(deleteUserFailure(data.message));
      return;
    }
    dispatch(deleteUserSuccess(data));
  } catch (error) {
    dispatch(deleteUserFailure(error.message));
  }
};