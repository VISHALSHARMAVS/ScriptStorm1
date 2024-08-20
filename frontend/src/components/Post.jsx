import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "./Modal";

export default function Post() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/post/getposts?userId=${currentUser._id}`
        );
        const data = res.data;

        if (data && data.posts) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchPosts();
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;

    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
        { withCredentials: true }
      );
      const data = res.data;

      if (data.posts && data.posts.length > 0) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false); // Disable "Show More" if fewer than 9 posts were returned
        }
      } else {
        setShowMore(false); // Disable "Show More" if no posts were returned
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      const res = await axios.delete(
        `http://localhost:3000/api/v1/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { withCredentials: true }
      );
      const data = res.data;
      if (!data) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 overflow-x-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {userPosts.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-200 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Post title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Delete
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {userPosts.map((post, index) => (
                <tr
                  key={post._id}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-24 h-12 object-cover rounded-md shadow-md"
                      />
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      className="text-teal-600 dark:text-teal-400 hover:underline"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {post.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-500 dark:text-red-400">
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="cursor-pointer hover:underline"
                    >
                      Delete
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600 dark:text-teal-400">
                    <Link
                      className="hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          You have no posts yet!
        </p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        handleDeleteUser={handleDeletePost}
        heading={"Are you sure you want to delete this post?"}
      />
    </div>
  );
}
