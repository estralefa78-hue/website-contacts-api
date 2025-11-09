const express = require("express");
const path = require("path");
const Airtable = require("airtable");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static("public"));

// Parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// --- Airtable setup ---
const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID, AIRTABLE_TABLE_NAME } = process.env;
if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID) {
  console.warn("⚠️  Missing Airtable env vars. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID.");
}
const base = new Airtable({ apiKey: AIRTABLE_TOKEN }).base(AIRTABLE_BASE_ID);
const tableName = AIRTABLE_TABLE_NAME || "Contacts";

// Health check
app.get("/health", (req, res) => res.json({ ok: true }));

// Contact endpoint
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message, website } = req.body;

    // Simple validations
    if (website) {
      // honeypot field (hidden) to block bots
      return res.status(400).json({ ok: false, error: "Bot suspected." });
    }
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "Please fill all required fields." });
    }

    // Save to Airtable (fields must match your table’s column names)
    await base(tableName).create([
      {
        fields: {
          Name: name,
          Email: email,
          Message: message,
          CreatedAt: new Date().toISOString()
        }
      }
    ]);

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to save. Check Airtable config." });
  }
});

// Fallback – serve index.html
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "index.html"))
);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
