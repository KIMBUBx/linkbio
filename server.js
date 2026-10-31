// server.js - Full-Stack Linktree Clone Application Server
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { db, verifyPassword } = require('./data/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ limit: '25mb', extended: true }));
app.use(cookieParser('linktree_secret_key_2026'));
app.use(express.static(path.join(__dirname, 'public')));

// Simple Auth Session Middleware
function authMiddleware(req, res, next) {
  const userId = req.signedCookies.userId;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Please login first' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    res.clearCookie('userId');
    return res.status(401).json({ error: 'User session expired' });
  }
  req.user = user;
  next();
}

function optionalAuthMiddleware(req, res, next) {
  const userId = req.signedCookies.userId;
  if (userId) {
    req.user = db.getUserById(userId) || null;
  }
  next();
}

// -------------------------------------------------------------
// HTML Page Routes
// -------------------------------------------------------------

// Landing Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'landing.html'));
});

// Login Page
app.get('/login', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// Signup Page
app.get('/signup', (req, res) => {
  if (req.signedCookies.userId) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// Admin Dashboard
app.get('/admin', (req, res) => {
  if (!req.signedCookies.userId) {
    return res.redirect('/login');
  }
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Logout
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/login');
});

// Click Tracking Redirect: /r/:linkId
app.get('/r/:linkId', (req, res) => {
  const { linkId } = req.params;
  const targetUrl = db.trackLinkClick(linkId);
  if (targetUrl) {
    return res.redirect(targetUrl);
  }
  res.status(404).send('Link not found or inactive');
});

// -------------------------------------------------------------
// REST API Routes
// -------------------------------------------------------------

// Check username availability
app.get('/api/check-username/:username', (req, res) => {
  const { username } = req.params;
  const user = db.getUserByUsername(username);
  res.json({ available: !user, username });
});

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, email, password, name } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }
    const user = db.createUser({ username, email, password, name });
    res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { usernameOrEmail, password } = req.body;
  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: 'Please enter username/email and password' });
  }

  let user = db.getUserByUsername(usernameOrEmail);
  if (!user) {
    user = db.getUserByEmail(usernameOrEmail);
  }

  if (!user || !verifyPassword(password, user.passwordHash, user.passwordSalt)) {
    return res.status(401).json({ error: 'Invalid username/email or password' });
  }

  res.cookie('userId', user.id, { signed: true, httpOnly: true, maxAge: 86400000 * 14 });
  res.json({ success: true, user });
});

// Get Current User Profile (Admin)
app.get('/api/user/me', authMiddleware, (req, res) => {
  const user = req.user;
  const links = db.getUserLinks(user.id);
  const analytics = db.getAnalytics(user.id);
  res.json({
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links,
    analytics
  });
});

// Update Profile Customization & Socials
app.put('/api/user/profile', authMiddleware, (req, res) => {
  try {
    const updated = db.updateUserProfile(req.user.id, req.body);
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add New Link
app.post('/api/user/links', authMiddleware, (req, res) => {
  try {
    const { title, url, icon, active } = req.body;
    const link = db.createLink(req.user.id, { title, url, icon, active });
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Link
app.put('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    const link = db.updateLink(req.user.id, req.params.id, req.body);
    res.json({ success: true, link });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Link
app.delete('/api/user/links/:id', authMiddleware, (req, res) => {
  try {
    db.deleteLink(req.user.id, req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reorder Links
app.put('/api/user/links-reorder', authMiddleware, (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    const links = db.reorderLinks(req.user.id, orderedIds);
    res.json({ success: true, links });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get Analytics
app.get('/api/user/analytics', authMiddleware, (req, res) => {
  try {
    const analytics = db.getAnalytics(req.user.id);
    res.json(analytics);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Public Bio Data Endpoint
app.get('/api/public/:username', (req, res) => {
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).json({ error: 'Creator not found' });
  }
  // Track profile view
  db.trackProfileView(user.id);

  const links = db.getUserLinks(user.id).filter(l => l.active);
  res.json({
    user: {
      username: user.username,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      verified: user.verified,
      theme: user.theme || 'clean',
      buttonStyle: user.buttonStyle || 'rounded',
      font: user.font || 'Inter',
      socialPlacement: user.socialPlacement || 'top',
      socials: user.socials || {},
      bgImage: user.bgImage || null,
      customBgColor: user.customBgColor,
      customTextColor: user.customTextColor,
      customBtnColor: user.customBtnColor,
      customBtnTextColor: user.customBtnTextColor
    },
    links
  });
});

// Public Bio Page: /:username
app.get('/:username', (req, res, next) => {
  const reserved = ['login', 'signup', 'admin', 'logout', 'r', 'api', 'css', 'js', 'images'];
  if (reserved.includes(req.params.username.toLowerCase())) {
    return next();
  }
  const user = db.getUserByUsername(req.params.username);
  if (!user) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>User Not Found - Linktree</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
      </head>
      <body class="bg-[#f3f3f1] min-h-screen flex items-center justify-center font-['Plus_Jakarta_Sans'] p-6">
        <div class="text-center max-w-md bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
          <div class="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🌴</div>
          <h1 class="text-2xl font-black text-stone-900 mb-2">The page you're looking for doesn't exist.</h1>
          <p class="text-stone-500 mb-6">Want this username? Claim <strong>@${req.params.username}</strong> now and create your own Linktree!</p>
          <a href="/signup?claim=${encodeURIComponent(req.params.username)}" class="inline-block w-full py-3.5 px-6 bg-[#d2e823] hover:bg-[#c0d619] text-stone-900 font-bold rounded-full transition shadow-sm">
            Claim this Linktree
          </a>
          <a href="/" class="inline-block mt-4 text-stone-500 text-sm font-semibold hover:underline">
            Go to Linktree Home
          </a>
        </div>
      </body>
      </html>
    `);
  }
  res.sendFile(path.join(__dirname, 'views', 'profile.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Linktree Clone running at: http://localhost:${PORT}`);
  console.log(`Demo accounts: alex / password123, sarah / password123, demo / demo123`);
});
