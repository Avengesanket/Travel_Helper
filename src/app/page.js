import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* --- Hero Section --- */}
      <section className='flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12'>
        
        {/* --- Text Content --- */}
        <div className='flex-1 text-center md:text-left'>
          <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight'>
            Welcome to Travel Helper
          </h1>
          <p className='mt-4 text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>
            Your one-stop destination for all things travel! Dive into our engaging travel blogs and make your travel dreams a reality with our innovative cost estimation tool.
          </p>
        </div>

        {/* --- Image --- */}
        <div className='flex-1'>
          <Image
            src="/mountain.jpg"
            alt="A scenic view of a mountain landscape with a train"
            width={600}
            height={400}
            priority 
            className='rounded-lg shadow-xl w-full h-auto'
          />
        </div>
      </section>

      <section className="text-center mt-16 py-12 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-2xl sm:text-3xl font-bold">
          Ready for Your Next Adventure?
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Calculate the cost of your next trip with our powerful estimation tool.
        </p>
        <Link href="/costEstimator" className='btn mt-6 inline-block text-lg px-8 py-3'>
          Estimate Your Trip
        </Link>
      </section>

    </main>
  );
}