import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Modal from './Modal';

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/comment/getcomments',{withCredentials:true});
        if (res.status === 200) {
          setComments(res.data.comments);
          if (res.data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await axios.get(`http://localhost:3000/api/v1/comment/getcomments?startIndex=${startIndex}`,{withCredentials:true});
      if (res.status === 200) {
        setComments((prev) => [...prev, ...res.data.comments]);
        if (res.data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(`http://localhost:3000/api/v1/comment/deleteComment/${commentIdToDelete}`,{withCredentials:true});
      if (res.status === 200) {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      } else {
        console.log(res.data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="overflow-x-auto md:mx-auto p-3">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left">Date updated</th>
                <th className="py-3 px-6 text-left">Comment content</th>
                <th className="py-3 px-6 text-center">Number of likes</th>
                <th className="py-3 px-6 text-center">PostId</th>
                <th className="py-3 px-6 text-center">UserId</th>
                <th className="py-3 px-6 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {comments.map((comment) => (
                <tr key={comment._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left">
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{comment.content}</td>
                  <td className="py-3 px-6 text-center">{comment.numberOfLikes}</td>
                  <td className="py-3 px-6 text-center">{comment.postId}</td>
                  <td className="py-3 px-6 text-center">{comment.userId}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">You have no comments yet!</p>
      )}
      <Modal show={showModal} onClose={()=>setShowModal(false)} handleDeleteUser={handleDeleteComment} heading={' Are you sure you want to delete this comment?'}/>
      
      
    </div>
  );
}
