# Dashboard

Next.js admin app, deployed to cPanel as a Node.js app.

## Deploy to cPanel

### 1. Build and package (on your machine)

1. Copy `.env.example` to `.env` and fill in the values. `NEXT_PUBLIC_*` values are baked in at build time, so set them before building.
2. Run:

   ```bash
   npm install
   npm run build
   npm run package:cpanel
   ```

3. This creates `cpanel-deploy/dashboard.zip`.

### 2. Upload (in cPanel)

1. Open **File Manager** and go to the app folder (Folder `~/natures-app/dashboard`).
2. Upload `dashboard.zip` and **Extract** it there.
3. Delete `dashboard.zip` after extracting if you want, else I recommend keep in the natures-app root directory.

### 3. Node.js app settings (first time only)

In **Setup Node.js App**, set **Application startup file** to `server.js`, mode to Production, Node 20 or higher.

### 4. Install and restart

Click **Run NPM Install**, then **Restart**.

## Updating the site

Repeat steps 1 and 2, then **Restart**. Run **Run NPM Install** again only if dependencies changed.
