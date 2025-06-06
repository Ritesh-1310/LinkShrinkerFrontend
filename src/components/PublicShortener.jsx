import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_API_URL } from '../utils/constants';


const PublicShortener = () => {
  const [url, setUrl] = useState("");
  const [shortenedLink, setShortenedLink] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleShorten = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/url/public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to shorten URL");
        setShortenedLink(null);
        return;
      }

      setShortenedLink(data.shortUrl);
      setError("");
      setUrl("");
    } catch (err) {
      console.error("Shorten Error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 🔹 Top Navbar */}
      <header className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow">
        <h1 className="text-2xl font-bold">LinkShrinker</h1>
        <button
          onClick={() => navigate("/login")}
          className="bg-white text-blue-600 px-7 py-2 rounded hover:bg-gray-200 font-medium"
        >
          Login
        </button>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* <section className="bg-white rounded shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Shorten Your URL
          </h2>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border px-4 py-2 rounded mb-4"
            placeholder="https://example.com/very/long/url"
          />
          <button
            onClick={handleShorten}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Shorten
          </button>

          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

          {shortenedLink && (
            <p className="text-green-600 mt-4 text-center">
              Shortened URL:{" "}
              <a
                href={shortenedLink}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                {shortenedLink}
              </a>
            </p>
          )}
        </section> */}

        <section className="bg-white p-6 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-2">Shorten Your Links</h2>

          <div className="flex gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-grow border px-4 py-2 rounded"
              placeholder="https://your-long-url.com"
            />
            <button
              onClick={handleShorten}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Shorten
            </button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
          {shortenedLink && (
            <p className="text-green-600 mt-2">
              Your shortened URL is: {" "}
              <a
                href={shortenedLink}
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                {shortenedLink}
              </a>
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default PublicShortener;
