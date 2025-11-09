# Contact → Airtable (Node + Express) — Deploy to Render

A tiny non-static site: a contact form (frontend) + Node/Express backend that saves submissions into Airtable.

## How it works
- Frontend: `/public/index.html` with a simple form.
- Backend: `server.js` exposes `POST /contact` and writes to Airtable.
- Environment variables keep your secrets safe.

---

## Local run (optional)
```bash
cp .env.example .env
# Then edit .env with your Airtable token and base id
npm install
npm run dev
# open http://localhost:3000
```

---

## Deploy on Render (step-by-step)
1. Push this folder to a **GitHub** repo (name it anything you like).
2. Go to **Render → New → Web Service**.
3. Connect your **GitHub** and pick the repo.
4. **Environment**: Node
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. Add **Environment Variables** on Render:
   - `AIRTABLE_TOKEN` = your Airtable personal access token
   - `AIRTABLE_BASE_ID` = your base id (starts with `app`)
   - `AIRTABLE_TABLE_NAME` = `Contacts` (or the table name you use)
8. Click **Create Web Service** and open your Render URL when it’s live.
9. Submit the form and check your Airtable base → table for the new record.

> Render provides the `PORT` env var automatically; the app uses it.

---

## Airtable setup
Create a base (e.g., **Website Contacts**) and a table named **Contacts** with fields:
- `Name` (Single line text)
- `Email` (Email or Single line text)
- `Message` (Long text)
- `CreatedAt` (Date) — optional; the app writes an ISO timestamp string.

If you rename the table or any field, update them in `server.js` accordingly.

---

## Security notes
- **Never commit your `.env`** or share your token publicly.
- If your token has been exposed, **revoke it in Airtable and create a new one**.
- Limit the token’s scopes to just what you need and restrict it to the specific base.
