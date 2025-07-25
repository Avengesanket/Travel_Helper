import Image from 'next/image';
import Link from 'next/link';
export default function Home() {
  return (
    <main>
    <section className='mt-4 flex justify-between leading-loose'>
    <p>
    <span className='text-xl font-bold'>
    Welcome to Travel Helper,<br />
    </span>
     Your one-stop destination for all things travel
    ! Whether you’re a seasoned traveller or planning your first big adventure,
     Travel Helper is here to inspire, guide, and support you every step of the way.
      Dive into our engaging travel blogs and make your travel dreams a reality
       with our innovative cost estimation tool.
    </p>
      <Image className='ml-5'
      src="/mountain.jpg"
      alt="Mountain"
      width={500}
      height={330}
      />
    </section>
    <h3 className='my-4'>
    Calculate the cost of your next trip with our cost estimation tool.
    </h3>
    <Link className='btn text-white text-sm px-5 py-2.5 font-bold bg-gray-800 focus:outline-none rounded-lg mt-4' 
    href="/costEstimator">Cost Estimation</Link>
    </main>
  );
}