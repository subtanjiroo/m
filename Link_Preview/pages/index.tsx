// pages/index.tsx
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-5xl font-bold mb-4 text-center">
          Welcome to <span className="text-yellow-300">Leandix AI</span>
        </h1>
        <p className="text-lg text-center max-w-2xl mb-6">
          Your intelligent assistant powered by cutting-edge AI technology.  
          Start exploring now and unlock the full potential of your conversations.
        </p>
        <div className="flex gap-4">
          <a
            href="/chat"
            className="bg-yellow-400 hover:bg-yellow-300 text-black px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            Start Chatting
          </a>
          <a
            href="https://platform.leandix.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white hover:bg-gray-100 text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg transition"
          >
            Learn More
          </a>
        </div>
      </main>

      <footer className="text-center py-4 text-sm text-white/70">
        © {new Date().getFullYear()} Leandix AI. All rights reserved.
      </footer>
    </>
  );
};

export default Home;
