

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();

// ✅ Allow requests from React (Vite dev server at 5173)
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET"],
}));

// ✅ Basic route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Video Streaming Server 🚀");
});

// ✅ Video streaming route
app.get("/video", (req, res) => {
  const filepath = path.join(
    "D:",
    "interview mern",
    "mern-interview-part-2",
    "Backend",
    "video",
    "video.mp4"
  );

  const stat = fs.statSync(filepath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    return res.status(416).send("Requires Range header");
  }

  // ✅ Parse Range header properly
  const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB
  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
//   const end = parts[1]
//     ? parseInt(parts[1], 10)
//     : Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
const end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
  const contentLength = end - start + 1;

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  // ✅ Must send 206 for streaming
  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(filepath, { start, end });
  videoStream.pipe(res);
});

// ✅ Start server
app.listen(4000, () => {
  console.log("Video server running at http://localhost:4000");
});
