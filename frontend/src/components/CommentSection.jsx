/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Comment from './Comment';
import Modal from './Modal';

export default function CommentSection({ postId }) {
  const { currentUser } = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }
    try {
      const res = await axios.post('http://localhost:3000/api/v1/comment/create', {
        content: comment,
        postId,
        userId: currentUser._id,
      },{withCredentials:true});
    
      const newComment = res.data;
      if (res.status === 200) {
         
        setComment('');
        setCommentError(null);
        setComments([newComment,...comments])
      }
    } catch (error) {
      setCommentError(error.response?.data?.message || error.message);
    }
  };
  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/comment/getPostComments/${postId}`);
        if (res.status === 200) {
          const data = await res.data;
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getComments();
  }, [postId]);

  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await axios.put(`http://localhost:3000/api/v1/comment/likeComment/${commentId}`,{}, {withCredentials:true});
      if (res.status==200) {
        const data = await res.data;
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await axios.delete(`http://localhost:3000/api/v1/comment/deleteComment/${commentId}`, {withCredentials:true});
      if (res.status==200) {
        // const data = await res.data;
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-sm'>
          <p>Signed in as:</p>
          <img
            className='h-5 w-5 object-cover rounded-full'
            src={currentUser.profilePicture}
            alt='Profile'
          />
          <Link
            to={'/dashboard?tab=profile'}
            className='text-xs text-cyan-600 hover:underline'
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment.
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className='border border-teal-500 rounded-md p-3'
        >
          <textarea
            className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
          <div className='flex justify-between items-center mt-5'>
            <p className='text-gray-500 text-xs'>
              {200 - comment.length} characters remaining
            </p>
            <button
              type='submit'
              className='bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-md hover:from-purple-600 hover:to-blue-600'
            >
              Submit
            </button>
          </div>
          {commentError && (
            <div className='mt-5 p-3 bg-red-100 text-red-700 rounded-md'>
              {commentError}
            </div>
          )}
        </form>
      )}
       {comments.length === 0 ? (
        <p className='text-sm my-5'>No comments yet!</p>
      ) : (
        <>
          <div className='text-sm my-5 flex items-center gap-1'>
            <p>Comments</p>
            <div className='border border-gray-400 py-1 px-2 rounded-sm'>
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {
                setShowModal(true);
                setCommentToDelete(commentId)
              }}/>
          ))}
        </>
      )}
      
      <Modal show={showModal} onClose={()=>setShowModal(false)} handleDeleteUser={()=>handleDelete(commentToDelete)} heading={"Are you sure you want to delete this comment?"}/>
    </div>
  );
}
