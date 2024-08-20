import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CreatePost() {
    const [file, setFile] = useState(null);
    const [imageUploadProgress, setImageUploadProgress] = useState(null);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [formData, setFormData] = useState({});
    const [publishError, setPublishError] = useState(null);

    const navigate = useNavigate();
    const handleUpdloadImage = async () => {
        try {
          if (!file) {
            setImageUploadError('Please select an image');
            return;
          }
          setImageUploadError(null);
          const storage = getStorage(app);
          const fileName = new Date().getTime() + '-' + file.name;
          const storageRef = ref(storage, fileName);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progress.toFixed(0));
            },
            (error) => {
              setImageUploadError('Image upload failed',error);
              setImageUploadProgress(null);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageUploadProgress(null);
                setImageUploadError(null);
                setFormData({ ...formData, image: downloadURL });
              });
            }
          );
        } catch (error) {
          setImageUploadError('Image upload failed');
          setImageUploadProgress(null);
          console.log(error);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('api/v1/post/create', formData, {          withCredentials: true, 
            });
          
            if (res.status !== 201) {
              setPublishError(res.data.message);
              return;
            }
          
            setPublishError(null);
            navigate(`/dashboard?tab=posts`);
          } catch (error) {
            if (error.response) {
              // The request was made, but the server responded with a status code that is not in the range of 2xx
              setPublishError(error.response.data.message || 'Something went wrong');
            } else if (error.request) {
              // The request was made, but no response was received
              setPublishError('No response from server');
            } else {
              // Something else happened in setting up the request
              setPublishError('Something went wrong');
            }
          }
          
      };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <input
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1 p-2 border border-gray-300 rounded-md'
            onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
          />
          <select
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
            required
            className='flex-1 p-2 border border-gray-300 rounded-md'
          >
            <option value='uncategorized'>Select a category</option>
            <option value='javascript'>JavaScript</option>
            <option value='reactjs'>React.js</option>
            <option value='nextjs'>Next.js</option>
          </select>
        </div>
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <input
            type='file'
            accept='image/*'
            className='flex-1 p-2 border border-gray-300 rounded-md'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-md outline-none'
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
                {imageUploadProgress ? (
              <div className='w-8 h-8'>
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              'Upload Image'
            )}
          </button>
        </div>
        {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )
        }
        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <button
          type='submit'
          className='px-4 py-2 font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md'
        >
          Publish
        </button>
        {publishError && (
          <Alert className='mt-5' color='failure'>
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
