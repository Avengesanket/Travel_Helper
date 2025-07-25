'use client'; 

import Image from 'next/image';

const BlogContent = ({ content }) => {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {content.map((block, index) => {
        if (block.type === 'paragraph') {
          return <p key={index}>{block.value}</p>;
        }
        if (block.type === 'image') {
          return (
            <div key={index} className="my-8">
                <Image
                    src={block.value}
                    alt={`Blog image ${index + 1}`}
                    width={800}
                    height={450}
                    className="rounded-lg shadow-md object-cover w-full h-auto"
                />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default BlogContent;