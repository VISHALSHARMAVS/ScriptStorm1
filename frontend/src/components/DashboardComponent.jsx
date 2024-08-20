import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/user/getusers?limit=5',{withCredentials:true});
        setUsers(res.data.users);
        setTotalUsers(res.data.totalUsers);
        setLastMonthUsers(res.data.lastMonthUsers);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/post/getposts?limit=5',);
        setPosts(res.data.posts);
        setTotalPosts(res.data.totalPosts);
        setLastMonthPosts(res.data.lastMonthPosts);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/comment/getcomments?limit=5',{withCredentials:true});
        setComments(res.data.comments);
        setTotalComments(res.data.totalComments);
        setLastMonthComments(res.data.lastMonthComments);
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Comments</h3>
              <p className='text-2xl'>{totalComments}</p>
            </div>
            <HiAnnotation className='bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Users</h1>
            <Link
              to='/dashboard?tab=users'
              className='text-purple-600 border border-purple-600 rounded-md px-3 py-1 hover:bg-purple-600 hover:text-white'
            >
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-700'>
                  <th className='p-2'>User Image</th>
                  <th className='p-2'>Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className='bg-white dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='p-2'>
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </td>
                    <td className='p-2'>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Comments</h1>
            <Link
              to='/dashboard?tab=comments'
              className='text-purple-600 border border-purple-600 rounded-md px-3 py-1 hover:bg-purple-600 hover:text-white'
            >
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-700'>
                  <th className='p-2'>Comment Content</th>
                  <th className='p-2'>Likes</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr
                    key={comment._id}
                    className='bg-white dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='p-2 w-96'>
                      <p className='line-clamp-2'>{comment.content}</p>
                    </td>
                    <td className='p-2'>{comment.numberOfLikes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent Posts</h1>
            <Link
              to='/dashboard?tab=posts'
              className='text-purple-600 border border-purple-600 rounded-md px-3 py-1 hover:bg-purple-600 hover:text-white'
            >
              See all
            </Link>
          </div>
          <div className='overflow-x-auto'>
            <table className='min-w-full text-left text-sm'>
              <thead>
                <tr className='bg-gray-50 dark:bg-gray-700'>
                  <th className='p-2'>Post Image</th>
                  <th className='p-2'>Post Title</th>
                  <th className='p-2'>Views</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className='bg-white dark:bg-gray-800 dark:border-gray-700'
                  >
                    <td className='p-2'>
                      <img
                        src={post.image}
                        alt='post'
                        className='w-16 h-10 bg-gray-500 object-cover rounded-sm'
                      />
                    </td>
                    <td className='p-2'>{post.title}</td>
                    <td className='p-2'>{post.numberOfViews}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
