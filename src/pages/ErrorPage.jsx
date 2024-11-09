import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to homepage when count reaches 0
    if (count === 0) {
      navigate("/");
    } else {
      // Start the countdown when component mounts
      const timer = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);

      // Cleanup timer when component unmounts or countdown finishes
      return () => clearInterval(timer);
    }
  }, [count, navigate]);

  return (
    <main className="min-h-screen min-w-full flex flex-col items-center justify-center gap-5">
      <h1 className="text-4xl w-full text-center">Error 404</h1>
      <h1 className="text-xl w-full text-center">
        Page Not Found
      </h1>
      <h1>
        Redirecting to Homepage in {count}...
      </h1>
    </main>
  );
};

export default ErrorPage;