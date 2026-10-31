# Frontend

Next.js app, deployed to cPanel as a Node.js app.

## Deploy to cPanel

### 1. Build and package (on your machine)

1. Copy `.env.example` to `.env` and fill in the values. `NEXT_PUBLIC_*` values are baked in at build time, so set them before building.
2. Run:

   ```bash
   npm install
   npm run build
   npm run package:cpanel
   ```

3. This creates `cpanel-deploy/frontend.zip`.

### 2. Upload (in cPanel)

1. Open **File Manager** and go to the app folder (Folder `~/natures-app/frontend`).
2. Upload `frontend.zip` and **Extract** it there.
3. Delete `frontend.zip` after extracting if you want, else I recommend keep in the natures-app root directory.

## Updating the site

Repeat steps 1, 2 and 3: build, package, upload and extract over the old files, then **Restart**. Run **Run NPM Install** again only if dependencies changed.
