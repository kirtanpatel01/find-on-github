import React, { useEffect, useState, useTransition } from "react";
import axios from "axios";
import moon from '../assets/moon.svg'
import sun from '../assets/sun.svg'

function Actions() {
  const [username, setUsername] = useState("kirtanpatel01");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useTransition(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


  const spinnerStyle = {
    border: "3px solid #f3f3f3",
    borderTop: "3px solid #3498db",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    animation: "spin 0.6s linear infinite",
  };

  const fetchData = () => {
    setError("");
    setData(null);
    setIsPending(async () => {
        try {
            const res = await axios.get(`https://api.github.com/users/${username}`);
            if (res) {
              setData(res.data);
              console.log(res.data);
            }
          } catch (error) {
            setError(`User Not Found!`);
          }
    })
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if(savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if(!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 pt-16 duration-300">

      <img 
      onClick={toggleDarkMode}
      src={isDarkMode ? moon : sun} 
      alt="dark-light-theme-btn"
      className="absolute top-4 right-4 h-12 p-2 rounded-md bg-slate-900 dark:bg-slate-400 cursor-pointer" />

      <input
        type="text"
        placeholder="Enter the username..."
        className="px-4 py-2 rounded-md bg-cyan-700 bg-opacity-10"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button
        onClick={() => fetchData()}
        disabled={isPending}
        className="min-w-28 flex justify-center text-white bg-slate-800 hover:bg-blue-700 p-2 rounded-md shadow-md tracking-wider duration-300"
      >
        {isPending ? (
          <div style={spinnerStyle} className="spinner" />
        ) : (
          "Get Data"
        )}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </button>

      {isPending && <span>Loading...</span>}

      {data ? (
        <div className="w-fit border border-slate-600 min-[475px]:px-16 min-[320px]:px-8 px-4 mx-2 py-8 flex flex-col items-center gap-8 bg-slate-100 dark:bg-slate-900 dark:bg-opacity-40">
          <h1 className="text-xl font-semibold tracking-wider">
            Profile Details
          </h1>
          <div className=" flex items-center gap-8 min-[320px]:gap-16 p-2 min-[320px]:p-4 border border-slate-600 rounded-2xl">
            <div className="flex flex-col">
              <span>{data.name}</span>
              <span className="text-sm text-slate-400">{data.login}</span>
            </div>
            <img
              src={data.avatar_url}
              alt="profile-image"
              className="h-14 min-[320px]:h-20 rounded-full"
            />
          </div>

          <div className="w-full h-[0.5px] bg-slate-600"></div>

          <span>Total Reposatories: {data.public_repos}</span>
          <span>Follwers: {data.followers}</span>
          <span className="flex min-[475px]:flex-row flex-col items-center gap-2">
            Github Link:{" "}
            <a
              target="_blank"
              href={data.html_url}
              className="border border-slate-500 p-2 rounded-lg mx-3 hover:bg-teal-400 hover:border-black hover:text-black"
            >
              Let me to their github page!
            </a>
          </span>
        </div>
      ) : (
        <span className="text-xl text-red-700">{error}</span>
      )}
    </div>
  );
}

export default Actions;
