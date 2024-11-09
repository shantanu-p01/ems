import {useEffect} from 'react';

const HomePage = () => {
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "EMS";
  }, []);

  return (
    <div className='min-h-screen min-w-full flex items-center justify-center'>
      HomePage
    </div>
  );
};

export default HomePage;