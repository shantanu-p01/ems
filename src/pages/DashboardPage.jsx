import {useEffect} from 'react';

const DashboardPage = () => {

  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "EMS - DashBoard";
  }, []);

  return (
    <div className='min-h-screen min-w-full flex items-center justify-center'>DashBoardPage</div>
  )
}

export default DashboardPage