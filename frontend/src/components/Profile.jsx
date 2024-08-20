import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { updateStart, updateSuccess, updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutSuccess } from '../redux/feature/userSlice';
import { useDispatch } from 'react-redux';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Alert from './Alert';
import axios from 'axios';
import Modal from './Modal';
function Profile() {
  const { currentUser , error} = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    profilePicture: currentUser?.profilePicture || ''
  });
  const dispatch = useDispatch();
  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(error,'Could not upload image (File must be less than 2MB)');
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
       
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData((prevFormData) => ({ ...prevFormData, profilePicture: downloadURL }));
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (e) => {
    setFormData((prevFormData) => ({ ...prevFormData, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError('No changes made');
      return;
    }
    if (imageFileUploading) {
      setUpdateUserError('Please wait for image to upload');
      return;
    }

    try {
      dispatch(updateStart());
      const res = await axios.put(`http://localhost:3000/api/v1/user/update/${currentUser._id}`, formData, { withCredentials: true });
      const data = res.data;

      if (!data.success) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.response?.data.message || error.message));
      setUpdateUserError(error.response?.data.message || 'An error occurred while updating the profile');
    }
  };

  if (!currentUser || !currentUser._id) {
    return <div>No Current User </div>; 
  }

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await axios.delete(`http://localhost:3000/api/v1/user/delete/${currentUser._id}` ,  { withCredentials: true })
      const data = await res.data;      
      if (!data.success) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleSignOut = async ()=>{

  try {
    const res=  await axios.post('http://localhost:3000/api/v1/user/signout')

   

    if (res.status===200) {
      dispatch(signoutSuccess())
    }
    else{
      console.log(res.message);
      
    }
  } catch (error) {
    console.log(error);
    
  }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt='user'
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>
        <div className='flex flex-col'>
          <input
            type='text'
            id='username'
            placeholder='username'
            defaultValue={currentUser.username}
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>
        <div className='flex flex-col'>
          <input
            type='email'
            id='email'
            placeholder='email'
            defaultValue={currentUser.email}
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>
        <div className='flex flex-col'>
          <input
            type='password'
            id='password'
            placeholder='password'
            onChange={handleChange}
            className='border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
        </div>
        <button
          type='submit'
          className='bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md border-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600'
        >
          Update
        </button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={() => setShowModal(true)}>Delete Account</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>
      {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
      {updateUserSuccess && <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>}
      {updateUserError && <Alert color='failure' className='mt-5'>{updateUserError}</Alert>}
      {error && (
        <Alert color='failure' className='mt-5'>
          {error}
        </Alert>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} handleDeleteUser={handleDeleteUser} heading={'Are you sure you want to delete your account?'}/>
    </div>
  );
}

export default Profile;
