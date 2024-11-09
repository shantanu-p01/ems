import React, { useState, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import AboutModal from '../modals/AboutModal';
import TermsOfServiceModal from '../modals/TermsOfServiceModal';  
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';  

const Footer = () => {
  const [openModal, setOpenModal] = useState(null); // Track which modal is open

  // Open and Close Modal Handler
  const toggleModal = (modal) => {
    setOpenModal(openModal === modal ? null : modal); // Toggle modal
  };

  // Handle page scroll and locking when modal is open
  useEffect(() => {
    if (openModal) {
      // Disable body scroll
      document.body.style.overflow = 'hidden';
      // Smooth scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Enable body scroll when all modals are closed
      document.body.style.overflow = 'auto';
    }
    return () => {
      // Cleanup overflow on unmount or modal change
      document.body.style.overflow = 'auto';
    };
  }, [openModal]);

  // Links and modals mapping
  const footerLinks = [
    { text: 'Contact', href: '/contact' },
    { text: 'About', modal: 'about' },
    { text: 'Privacy Policy', modal: 'privacy' },
    { text: 'Terms of Service', modal: 'terms' }
  ];

  const socialLinks = [
    { icon: FaFacebook, link: 'https://facebook.com', color: '#3b5998' },
    { icon: FaTwitter, link: 'https://twitter.com', color: '#00acee' },
    { icon: FaLinkedin, link: 'https://linkedin.com', color: '#0077b5' },
    { icon: FaInstagram, link: 'https://instagram.com', color: '#E1306C' }
  ];

  return (
    <footer className="select-none bg-[#212121] p-4 text-white">
      {/* Footer Title */}
      <h1 className="text-3xl font-bold text-center mb-4">Employee Management System</h1>

      {/* Footer Links */}
      <ul className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-10 mb-6">
        {footerLinks.map(({ text, href, modal }, index) => (
          <li key={index}>
            {modal ? (
              <button
                onClick={() => toggleModal(modal)}
                className="text-lg hover:text-[#FFB100] duration-300"
              >
                {text}
              </button>
            ) : (
              <a
                href={href}
                className="text-lg hover:text-[#FFB100] duration-300"
              >
                {text}
              </a>
            )}
          </li>
        ))}
      </ul>

      {/* Social Media Icons */}
      <div className="flex gap-6 mb-4 justify-center">
        {socialLinks.map(({ icon: Icon, link, color }, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            draggable="false"
            className="text-white hover:text-[color] duration-300"
          >
            <Icon size={30} style={{ color }} />
          </a>
        ))}
      </div>

      {/* Footer Bottom Text */}
      <div className="text-center text-sm">
        <p>&#169; 2024 Employee Management System. All Rights Reserved.</p>
      </div>

      {/* Conditionally Render Modals */}
      {openModal === 'about' && <AboutModal closeModal={() => toggleModal('about')} />}
      {openModal === 'terms' && <TermsOfServiceModal closeModal={() => toggleModal('terms')} />}
      {openModal === 'privacy' && <PrivacyPolicyModal closeModal={() => toggleModal('privacy')} />}
    </footer>
  );
};

export default Footer;