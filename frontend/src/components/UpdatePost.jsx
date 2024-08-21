import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);  

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://scriptstorm1.onrender.com/api/v1/post/getposts?postId=${postId}`);
  
        if (res.status === 200 && res.data.posts.length > 0) {
           
          setFormData(res.data.posts[0]);
        } else {
          setPublishError(res.data.message || 'Post not found');
        }
      } catch (error) {
        setPublishError(error.message);
      }
    };
  
    fetchPost();
  }, [postId]);
  

  const handleUpdloadImage = async () => {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
        
      const res = await axios.put(
        `https://scriptstorm1.onrender.com/api/v1/post/updatepost/${postId}/${currentUser._id}`,formData,{withCredentials:true});

      if (res.status === 200) {
        navigate(`/post/${res.data.slug}`);
      } else {
        setPublishError(res.data.message);
      }
    } catch (error) {
      setPublishError('Something went wrong',error);
    }

  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <input
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1 p-2 border rounded-md'
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <select
            className='p-2 border rounded-md'
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
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
            onChange={(e) => setFile(e.target.files[0])}
            className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
          />
          <button
            type='button'
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
            className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg disabled:opacity-50'
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
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
        {imageUploadError && (
          <div className='text-red-500'>{imageUploadError}</div>
        )}
        {formData.image && (
          <img
            src={formData.image}
            alt='upload'
            className='w-full h-72 object-cover'
          />
        )}
        <ReactQuill
          theme='snow'
          value={formData.content}
          placeholder='Write something...'
          className='h-72 mb-12'
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <button
          type='submit'
          className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg'
        >
          Update post
        </button>
        {publishError && (
          <div className='mt-5 text-red-500'>{publishError}</div>
        )}
      </form>
    </div>
  );
}
