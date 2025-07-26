const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/user");
const Note = require("./models/notes");
const { authenticateToken } = require("./utilities");

dotenv.config(); // Load .env file

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(express.json());
app.use(cors({ origin: "https://notesweb-frontend.onrender.com" }));

// Routes
app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.get("/api/notes", (req, res) => {
  res.json([{id: 1, title:"First Note" ,content:"Hello from backend" },{id:2,title:"Second Note" ,content:"Another Note"}]);
});

// Register
app.post("/create-account", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User({ fullName, email, password });
    await user.save(); // ✅ This was missing before!

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      accessToken,
      user,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error while creating account" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "All fields required" });

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(400).json({ error: true, message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  return res.json({
    error: false,
    message: "Login successful",
    accessToken,
  });
});

// Get Authenticated User
app.get("/get-user", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (!user) return res.sendStatus(401);

  return res.json({
    user: {
      fullName: user.fullName,
      email: user.email,
      _id: user._id,
      createdOn: user.createdOn,
    },
  });
});

// Add Note
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const userId = req.user.id;

  if (!title || !content) {
    return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
    const note = new Note({ title, content, tags, userId });
    await note.save();

    return res.json({ error: false, note, message: "Note added successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update Note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: noteId, userId: req.user.id });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (typeof isPinned === "boolean") note.isPinned = isPinned;

    await note.save();
    return res.json({ error: false, note, message: "Note updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Get All Notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id }).sort({ isPinned: -1 });
    return res.json({ error: false, notes });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Delete Note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.noteId, userId: req.user.id });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    return res.json({ error: false, message: "Note deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const { isPinned } = req.body;

  try {
    const note = await Note.findOne({ _id: req.params.noteId, userId: req.user.id });
    if (!note) return res.status(404).json({ error: true, message: "Note not found" });

    note.isPinned = isPinned;
    await note.save();

    return res.json({ error: false, note, message: "Pinned status updated" });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Search Notes
app.get("/search-notes", authenticateToken, async (req, res) => {
  const query = req.query.q;

  if (!query) return res.status(400).json({ error: true, message: "Search query is required" });

  try {
    const notes = await Note.find({
      userId: req.user.id,
      $or: [
        { title: new RegExp(query, "i") },
        { content: new RegExp(query, "i") },
      ],
    });

    return res.json({ error: false, notes });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
