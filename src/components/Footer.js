const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 py-6 mt-12 border-t border-gray-200 dark:border-gray-700">
  
      <div className="w-full max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} Travel Helper. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;