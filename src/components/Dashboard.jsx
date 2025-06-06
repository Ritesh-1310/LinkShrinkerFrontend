import React, { useEffect, useState } from "react";
import { BASE_API_URL } from '../utils/constants';

const Dashboard = () => {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [shortenedLink, setShortenedLink] = useState(null);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to shorten URL");
        setShortenedLink(null);
        return;
      }

      const result = await response.json();
      const newLink = {
        originalUrl: url,
        shortUrl: `${BASE_API_URL}/api/url/${result.shortId}`,
        shortId: result.shortId,
        clicks: 0,
        _id: result._id || result.shortId,
        visitHistory: [],
      };

      setLinks([newLink, ...links]);
      setShortenedLink(newLink.shortUrl);
      setUrl("");
      setError("");
    } catch (err) {
      console.error("Shorten Error:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this link?"
    );
    if (!confirmDelete) return;

    const shortId = links[index].shortId;

    try {
      const res = await fetch(
        `${BASE_API_URL}/api/url/delete/${shortId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        const updatedLinks = [...links];
        updatedLinks.splice(index, 1);
        setLinks(updatedLinks);
      } else {
        alert("Failed to delete link.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch(`${BASE_API_URL}/api/url`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok && data.urls) {
        const mappedLinks = data.urls.map((item) => ({
          originalUrl: item.redirectURL,
          shortId: item.shortId,
          shortUrl: `${BASE_API_URL}/api/url/${item.shortId}`,
          clicks: item.visitHistory?.length || 0,
          visitHistory: item.visitHistory,
          _id: item._id,
        }));
        setLinks(mappedLinks);
      } else {
        setLinks([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setLinks([]);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/login";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-6 px-8 flex justify-between items-center shadow relative">
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold">LinkShrinker</h1>
          <p className="text-sm">
            Shorten, Track, and Manage Your Links with Ease
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-7 py-2 rounded hover:bg-gray-200 font-medium"
        >
          Logout
        </button>
      </header>

      <main className="p-6 max-w-[1500px] mx-auto">

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

        {links.length > 0 ? (
          <section className="bg-blue-100 p-6 rounded shadow w-full">
            <h2 className="text-xl font-semibold mb-4">Your Link History</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full border border-gray-300 table-fixed text-center">
                <thead className="bg-blue-200 font-semibold">
                  <tr>
                    <th className="border border-gray-400 px-2 py-2">S. No</th>
                    <th className="border border-gray-400 px-2 py-2 w-[550px]">
                      Original URL
                    </th>
                    <th className="border border-gray-400 px-4 py-2 w-[300px]">
                      Shortened URL
                    </th>
                    <th className="border border-gray-400 px-2 py-2">
                      ShortID
                    </th>
                    <th className="border border-gray-400 px-2 py-2">Clicks</th>
                    <th className="border border-gray-400 px-2 py-2">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, index) => (
                    <tr
                      key={link._id || link.shortId}
                      className="bg-white even:bg-gray-100"
                    >
                      <td className="border border-gray-300 px-2 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 underline text-left break-words w-[550px] max-w-[550px]">
                        <a
                          href={link.originalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {link.originalUrl}
                        </a>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 underline text-left break-words w-[300px] max-w-[300px]">
                        <a
                          href={link.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {link.shortUrl}
                        </a>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 break-words">
                        {link.shortId}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        {link.visitHistory?.length ?? link.clicks}
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <button
                          onClick={() => handleDelete(index)}
                          className="text-red-600 text-lg"
                          title="Delete link"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <div className="text-center text-gray-500 mt-4">
            You haven't shortened any URLs yet.
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
