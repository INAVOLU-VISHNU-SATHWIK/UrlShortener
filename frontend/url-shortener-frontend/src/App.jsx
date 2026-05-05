import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          alias,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      toast.success("Short URL created!");
    } catch (err) {
      toast.error(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success("Copied!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white px-6 py-10">
      
      <Toaster position="top-center" />

      {/* Header */}
      <div className="max-w-6xl mb-10">
        <h1 className="text-4xl font-bold mb-2">🔗 URL Shortener</h1>
        <p className="text-gray-300">
          Create short, clean links and track usage effortlessly.
        </p>
      </div>

      {/* Main Layout */}
      <div className="max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT: FORM */}
        <div className="bg-white text-black p-6 rounded-2xl shadow-xl">
          
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Create Short URL</h2>

          <input
            type="text"
            placeholder="Enter long URL..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Custom alias (optional)"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            onClick={handleShorten}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Shorten URL"}
          </button>
        </div>

        {/* RIGHT: RESULT PANEL */}
        <div className="bg-white text-black p-6 rounded-2xl shadow-xl flex flex-col justify-center">
          
          <h2 className="text-xl font-semibold mb-4 text-purple-600">Result</h2>

          {!shortUrl ? (
            <p className="text-gray-500">
              Your shortened URL will appear here.
            </p>
          ) : (
            <div className="space-y-4">
              
              <div>
                <p className="text-gray-500 text-sm">Short URL</p>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold break-all flex-1"
                  >
                    {shortUrl}
                  </a>
                  <button
                    onClick={handleCopy}
                    className="bg-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Status</p>
                <p className="text-green-600 font-medium">
                  Active and ready to use
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;