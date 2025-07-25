import Link from 'next/link';

const NotFound = () => { 
  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">

      <h1 className="text-6xl sm:text-8xl font-extrabold text-blue-600 dark:text-blue-500">
        404
      </h1>
      <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200">
        Page Not Found
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Sorry, we couldn’t find the page you’re looking for.
      </p>

      <Link href="/" className="btn mt-8 text-lg">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;