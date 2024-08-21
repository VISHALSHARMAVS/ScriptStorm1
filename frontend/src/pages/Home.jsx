import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get('https://scriptstorm1.onrender.com/api/v1/post/getPosts');
      const data = await res.data;
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
      <div className='flex flex-col items-center text-center gap-6 p-8 md:p-16 w-full'>
        <h1 className='text-4xl md:text-6xl font-extrabold text-teal-600 dark:text-teal-400'>
          Welcome to ScriptStorm
        </h1>
        <p className='text-gray-700 dark:text-gray-300 text-sm sm:text-lg max-w-4xl py-4'>
        {`Explore a diverse range of content on ScriptStorm, where you can find everything from personal stories and poems to insightful blog posts, articles and many more. Whether you're here to share your thoughts or discover new perspectives, there's something for everyone.`}
        </p>
        <Link
          to='/search'
          className='text-base md:text-lg text-teal-600 dark:text-teal-400 font-semibold hover:underline transition duration-200 ease-in-out'
        >
          View all posts
        </Link>
      </div>

      <div className='w-full p-6 md:px-16 md:py-8'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-gray-100'>
              Recent Posts
            </h2>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-600 dark:text-teal-400 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
