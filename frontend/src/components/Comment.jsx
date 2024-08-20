/* eslint-disable react/prop-types */
import axios from 'axios';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FaThumbsUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function Comment({ comment , onLike,onEdit,onDelete}) {
  const [user, setUser] = useState({});
  const { currentUser } = useSelector((state) => state.user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/user/${comment.userId}`);
        const data = await res.data;
        if (res.status === 200) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res  = await axios.put(`http://localhost:3000/api/v1/comment/editComment/${comment._id}`,editedContent, {withCredentials:true});
      if (res.status==200) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }

  }
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img
          className='w-10 h-10 rounded-full bg-gray-200'
          src={user.profilePicture}
          alt={user.username}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : 'anonymous user'}
          </span>
          <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
        </div>
        {isEditing ? (<>
            <textarea
            className='mb-2 w-full p-2 border border-gray-300 rounded-md'
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows='3'
          />
          <div className="flex justify-end gap-2 text-xs">
            <button
              type='button'
              className='bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-blue-600'
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type='button'
              className='bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-100'
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      ):(<>
        
            <p className='text-gray-500 pb-2'>{comment.content}</p>
        <div className='flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2'>
          <button
            type='button'
            onClick={() => onLike(comment._id)}
            className={`text-gray-400 hover:text-blue-500 ${
              currentUser &&
              comment.likes.includes(currentUser._id) &&
              '!text-blue-500'
            }`}
          >
            <FaThumbsUp className='text-sm' />
          </button>
          <p className='text-gray-400'>
            {comment.numberOfLikes > 0 &&
              comment.numberOfLikes +
                ' ' +
                (comment.numberOfLikes === 1 ? 'like' : 'likes')}
          </p>
          {currentUser &&
                (currentUser._id === comment.userId || currentUser.isAdmin) && (
                    <>
                  <button
                    type='button'
                    onClick={handleEdit}
                    className='text-gray-400 hover:text-blue-500'
                  >
                    Edit
                  </button>
                   <button
                   type='button'
                   onClick={() => onDelete(comment._id)}
                   className='text-gray-400 hover:text-red-500'
                 >
                   Delete
                 </button>
                 </>
                )}
        </div>
        </>)}
        
      </div>
    </div>
  );
}