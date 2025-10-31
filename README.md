Test Login Project (Bootstrap + Firebase Auth + Google signin)
===============================================================

Files:
- index.html       -> Login page (email/password + Google)
- dashboard.html   -> Simple protected dashboard
- styles.css       -> Polished styles + animations
- app.js           -> Firebase config + auth logic (single module)
- assets/google-mark.svg -> Google mark used in button

Setup:
1. In Firebase Console -> Authentication -> Sign-in method -> enable Email/Password and Google.
2. In Firebase Console -> Authentication -> Users you can create users via Create account on the site.
3. Serve the folder over HTTP (recommended) — e.g. using VSCode Live Server or `npx http-server`.
4. Open index.html, create account or use Google sign-in.

Notes:
- I inserted the Firebase config you provided into app.js.
- Make sure in Firebase Console -> Authentication -> Authorized domains you add 'localhost' (if testing locally).
- If you want, I can also deploy this folder to Firebase Hosting for you.
