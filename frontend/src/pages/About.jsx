export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl  font-extrabold text-teal-600 dark:text-teal-400 text-center my-7'>
            About ScriptStorm
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
             {` Welcome to ScriptStorm! Our platform was created to bring together a diverse range of content, from personal stories and poems to engaging blog articles, news, and more. We provide a space for anyone to share their voice and connect with a community of readers.`}
            </p>

            <p>
             {` On ScriptStorm, you'll find a rich variety of posts, including creative writing, informative articles, and updates on current events. Whether you're here to explore new perspectives, share your own experiences, or stay informed, there's always something new and exciting to discover.`}
            </p>

            <p>
              {`We encourage you to engage with our community by leaving comments, liking posts, and joining discussions. Your participation helps foster a vibrant and supportive environment where everyone can learn, grow, and connect.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
