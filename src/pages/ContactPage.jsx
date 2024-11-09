import {useEffect} from 'react';

const ContactPage = () => {
  
  useEffect(() => {
    // Set the document title when the component mounts
    document.title = "EMS - Contact";
  }, []);

  return (
    <div className='min-h-screen min-w-full flex items-center justify-center'>ContactPage</div>
  )
}

export default ContactPage