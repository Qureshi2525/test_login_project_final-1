// app.js (type=module)
// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

/* Firebase config inserted by assistant on user's request */
const firebaseConfig = {
  apiKey: "AIzaSyC6KQamG5H6VXxFjfL4e888IOHN5Rqjq-U",
  authDomain: "test-login-project-e251a.firebaseapp.com",
  projectId: "test-login-project-e251a",
  storageBucket: "test-login-project-e251a.firebasestorage.app",
  messagingSenderId: "825923437229",
  appId: "1:825923437229:web:4e41eef0b0cc4be920fc24",
  measurementId: "G-5P96PPBJ41"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(()=>{});

// helper functions for UI
function el(id){ return document.getElementById(id); }
function showAuthAlert(text, type='danger') {
  const elA = el('authAlert');
  if (!elA) return;
  elA.className = `alert alert-${type}`;
  elA.textContent = text;
  elA.classList.remove('d-none');
}
function hideAuthAlert(){ const a = el('authAlert'); if(a) a.classList.add('d-none'); }

// Index page handlers
if (el('loginForm')) {
  el('year').textContent = new Date().getFullYear();
  const loginForm = el('loginForm');
  const emailIn = el('email');
  const pwdIn = el('password');
  const loginBtn = el('loginBtn');
  const signupBtn = el('signupBtn');
  const forgotLink = el('forgotLink');
  const togglePwd = el('togglePwd');
  const googleBtn = el('googleBtn');

  togglePwd.addEventListener('click', () => {
    pwdIn.type = pwdIn.type === 'password' ? 'text' : 'password';
    togglePwd.querySelector('i').classList.toggle('bi-eye');
    togglePwd.querySelector('i').classList.toggle('bi-eye-slash');
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthAlert();
    if (!emailIn.value || !pwdIn.value || pwdIn.value.length < 6) {
      if (!emailIn.value) emailIn.classList.add('is-invalid'); else emailIn.classList.remove('is-invalid');
      if (!pwdIn.value || pwdIn.value.length < 6) pwdIn.classList.add('is-invalid'); else pwdIn.classList.remove('is-invalid');
      return;
    }
    loginBtn.disabled = true;
    loginBtn.textContent = 'Signing in...';
    try {
      await signInWithEmailAndPassword(auth, emailIn.value.trim(), pwdIn.value);
    } catch (err) {
      console.error(err);
      showAuthAlert(err.message || 'Login failed', 'danger');
      loginBtn.disabled = false;
      loginBtn.textContent = 'Sign in';
    }
  });

  signupBtn.addEventListener('click', async () => {
    hideAuthAlert();
    const em = emailIn.value.trim();
    const pw = pwdIn.value;
    if (!em || !pw || pw.length < 6) {
      showAuthAlert('Enter a valid email and password (min 6 chars).', 'warning');
      return;
    }
    signupBtn.disabled = true;
    signupBtn.textContent = 'Creating...';
    try {
      await createUserWithEmailAndPassword(auth, em, pw);
    } catch (err) {
      console.error(err);
      showAuthAlert(err.message || 'Could not create account', 'danger');
      signupBtn.disabled = false;
      signupBtn.textContent = 'Create account';
    }
  });

  forgotLink.addEventListener('click', async (ev) => {
    ev.preventDefault();
    hideAuthAlert();
    const em = emailIn.value.trim();
    if (!em) {
      showAuthAlert('Enter your email, then click Forgot.', 'warning');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, em);
      showAuthAlert('Password reset email sent. Check your inbox.', 'success');
    } catch (err) {
      console.error(err);
      showAuthAlert(err.message || 'Could not send reset email', 'danger');
    }
  });

  // Google sign-in
  googleBtn.addEventListener('click', async () => {
    hideAuthAlert();
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // redirect handled by onAuthStateChanged
    } catch (err) {
      console.error(err);
      showAuthAlert(err.message || 'Google sign-in failed', 'danger');
    }
  });
}

// Auth state listener and dashboard logic
onAuthStateChanged(auth, (user) => {
  // Redirect signed-in users to dashboard
  if (user && (location.pathname.endsWith('index.html') || location.pathname === '/')) {
    location.href = 'dashboard.html';
  }

  // If dashboard open but not signed in -> redirect to index
  if (!user && location.pathname.endsWith('dashboard.html')) {
    location.href = 'index.html';
  }

  // Dashboard content
  if (user && location.pathname.endsWith('dashboard.html')) {
    const emailEl = el('userEmail');
    const welcome = el('welcomeMsg');
    emailEl.textContent = user.email || '';
    welcome.textContent = `You are signed in as ${user.email}. This is a test dashboard.`;
    const signOutBtn = el('signOutBtn');
    signOutBtn.addEventListener('click', async () => {
      await signOut(auth);
      // onAuthStateChanged will redirect to index.html
    });
    const reloadBtn = el('reloadBtn');
    if (reloadBtn) reloadBtn.addEventListener('click', ()=> location.reload());
  }
});

// DOM ready small helper
document.addEventListener('DOMContentLoaded', () => {
  const authAlert = el('authAlert');
  if (authAlert) authAlert.classList.add('d-none');
});

const provider = new firebase.auth.GoogleAuthProvider();
auth.signInWithPopup(provider).catch(error => {
  if (error.code === 'auth/popup-blocked') {
    auth.signInWithRedirect(provider);
  }
});

