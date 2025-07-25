"use client";
import Link from 'next/link';
const notFound = () => {
  return (
    <div className='text-center text-2xl text-bold'>
      <h1>404 Not Found</h1>
      <Link href="/" className='text-indigo-700'>Return to Homepage</Link>
    </div>
  );
}
export default notFound;