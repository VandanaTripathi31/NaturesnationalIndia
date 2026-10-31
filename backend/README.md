# Backend

Express API, deployed to cPanel as a Node.js app.

## Deploy to cPanel

### 1. Package (on your machine)

Run:

```bash
npm install
npm run package:cpanel
```

This creates `cpanel-deploy/backend.zip`. It contains only runtime files: no `node_modules`, no `.env`, no migration or test scripts.

### 2. Upload (in cPanel)

1. Open **File Manager** and go to the app folder (Folder `~/natures-app/backend`).
2. Upload `backend.zip` and **Extract** it there.
3. Delete `backend.zip` after extracting if you want, else I recommend keep in the natures-app root directory.
4. Make sure a `.env` file exists in the app folder (it is not in the zip). Use `.env.example` as the template. Create it once; later updates do not touch it.

### 3. Node.js app settings (first time only)

In **Setup Node.js App**, set **Application startup file** to `app.cjs` (not `server.js`). `app.cjs` is a wrapper that Passenger can load.

### 4. Install and restart

Click **Run NPM Install**, then **Restart**.

## Updating the site

Repeat steps 1 and 2, then **Restart**. Run **Run NPM Install** again only if dependencies changed.
