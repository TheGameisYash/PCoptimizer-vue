require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET || 'pcoptimizer_secret_' + Math.random(),
  PORT: process.env.PORT || 3001,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

// Firebase setup
let db;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com`
    });
  }
  
  db = admin.firestore();
  console.log('🔥 Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

const app = express();

// Enhanced middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: CONFIG.FRONTEND_URL,
  credentials: true
}));

// Different rate limits for different endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // 5 for prod, 50 for dev
  message: { error: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

app.use(session({
  secret: CONFIG.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    secure: false,
    sameSite: 'lax'
  }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enhanced Database helpers
async function getLicenses() {
  try {
    const snapshot = await db.collection('licenses').get();
    const licenses = {};
    snapshot.forEach(doc => {
      licenses[doc.id] = doc.data();
    });
    return licenses;
  } catch (error) {
    console.error('Error getting licenses:', error);
    return {};
  }
}

async function getLicense(licenseKey) {
  try {
    const doc = await db.collection('licenses').doc(licenseKey).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error('Error getting license:', error);
    return null;
  }
}

async function saveLicense(licenseKey, data) {
  try {
    await db.collection('licenses').doc(licenseKey).set(data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving license:', error);
    return false;
  }
}

async function deleteLicense(licenseKey) {
  try {
    await db.collection('licenses').doc(licenseKey).delete();
    return true;
  } catch (error) {
    console.error('Error deleting license:', error);
    return false;
  }
}

async function getBanlist() {
  try {
    const doc = await db.collection('settings').doc('banlist').get();
    return doc.exists ? doc.data().hwids || [] : [];
  } catch (error) {
    console.error('Error getting banlist:', error);
    return [];
  }
}

async function saveBanlist(banlist) {
  try {
    await db.collection('settings').doc('banlist').set({ hwids: banlist });
    return true;
  } catch (error) {
    console.error('Error saving banlist:', error);
    return false;
  }
}

// Enhanced Activity Logging with Audit Trail
async function logActivity(action, details, ip = 'unknown', userAgent = 'unknown', userId = 'system', metadata = {}) {
  try {
    const logEntry = {
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      action,
      details,
      ip,
      userAgent,
      userId,
      metadata,
      date: new Date().toISOString(),
      severity: getSeverityLevel(action),
      category: getCategoryFromAction(action)
    };
    
    await db.collection('activityLog').add(logEntry);
    
    // Also store in audit trail for compliance
    await db.collection('auditTrail').add({
      ...logEntry,
      auditId: crypto.randomUUID(),
      compliant: true
    });
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

function getSeverityLevel(action) {
  if (action.includes('FAILED') || action.includes('SECURITY')) return 'HIGH';
  if (action.includes('DELETE') || action.includes('BAN')) return 'MEDIUM';
  return 'LOW';
}

function getCategoryFromAction(action) {
  if (action.includes('LOGIN') || action.includes('AUTH')) return 'AUTHENTICATION';
  if (action.includes('LICENSE')) return 'LICENSE_MANAGEMENT';
  if (action.includes('BAN') || action.includes('HWID')) return 'SECURITY';
  if (action.includes('API')) return 'API_USAGE';
  if (action.includes('USER')) return 'USER_MANAGEMENT';
  return 'SYSTEM';
}

async function getActivityLog(limit = 100, category = null, severity = null) {
  try {
    let query = db.collection('activityLog').orderBy('timestamp', 'desc');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (severity) {
      query = query.where('severity', '==', severity);
    }
    
    const snapshot = await query.limit(limit).get();
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting activity log:', error);
    return [];
  }
}

// Notification system
async function createNotification(userId, type, title, message, category = 'SYSTEM') {
  try {
    await db.collection('notifications').add({
      userId,
      type,
      title,
      message,
      category,
      timestamp: new Date().toISOString(),
      read: false
    });
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
}

// System Analytics
async function getSystemAnalytics() {
  try {
    const licenses = await getLicenses();
    const banlist = await getBanlist();
    const activitySnapshot = await db.collection('activityLog')
      .where('timestamp', '>=', admin.firestore.Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
      .get();

    const activities = activitySnapshot.docs.map(doc => doc.data());
    
    // Calculate metrics
    const totalLicenses = Object.keys(licenses).length;
    const activeLicenses = Object.values(licenses).filter(l => l.hwid).length;
    const expiredLicenses = Object.values(licenses).filter(l => 
      l.expiry && new Date(l.expiry) < new Date()
    ).length;
    
    // API usage analytics
    const apiCalls = activities.filter(a => a.action.includes('API')).length;
    const validationCalls = activities.filter(a => a.action === 'API_VALIDATE').length;
    const registrationCalls = activities.filter(a => a.action === 'API_REGISTER').length;
    
    // Security events
    const securityEvents = activities.filter(a => a.severity === 'HIGH').length;
    const failedLogins = activities.filter(a => a.action.includes('FAILED')).length;
    
    // Daily activity for charts
    const dailyActivity = getDailyActivityStats(activities);
    const licenseStatusDistribution = {
      active: activeLicenses,
      inactive: totalLicenses - activeLicenses - expiredLicenses,
      expired: expiredLicenses
    };

    return {
      overview: {
        totalLicenses,
        activeLicenses,
        expiredLicenses,
        bannedHwids: banlist.length,
        apiCalls,
        validationCalls,
        registrationCalls,
        securityEvents,
        failedLogins
      },
      charts: {
        dailyActivity,
        licenseStatusDistribution
      },
      performance: await getPerformanceMetrics()
    };
  } catch (error) {
    console.error('Error getting analytics:', error);
    return {};
  }
}

function getDailyActivityStats(activities) {
  const last7Days = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    last7Days[dateStr] = 0;
  }

  activities.forEach(activity => {
    const date = new Date(activity.date).toISOString().split('T')[0];
    if (last7Days.hasOwnProperty(date)) {
      last7Days[date]++;
    }
  });

  return Object.entries(last7Days).map(([date, count]) => ({
    date,
    count
  }));
}

async function getPerformanceMetrics() {
  const process = require('process');
  const os = require('os');
  
  return {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    systemInfo: {
      platform: os.platform(),
      cpus: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      loadAverage: os.loadavg()
    }
  };
}

// System Settings Management
async function getSystemSettings() {
  try {
    const doc = await db.collection('settings').doc('system').get();
    return doc.exists ? doc.data() : {
      maintenanceMode: false,
      registrationEnabled: true,
      validationTimeout: 30,
      maxLicensesPerHwid: 1,
      autoCleanupExpired: false,
      emailNotifications: false,
      backupEnabled: true,
      debugMode: false
    };
  } catch (error) {
    console.error('Error getting system settings:', error);
    return {};
  }
}

async function updateSystemSettings(settings) {
  try {
    await db.collection('settings').doc('system').set(settings, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating system settings:', error);
    return false;
  }
}

// Backup functionality
async function createBackup() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = {
      timestamp,
      licenses: await getLicenses(),
      banlist: await getBanlist(),
      settings: await getSystemSettings(),
      metadata: {
        version: '1.0.0',
        createdBy: 'system'
      }
    };

    // Store backup in Firebase
    await db.collection('backups').doc(timestamp).set(backup);
    
    return { success: true, backupId: timestamp };
  } catch (error) {
    console.error('Error creating backup:', error);
    return { success: false, error: error.message };
  }
}

async function getBackups() {
  try {
    const snapshot = await db.collection('backups').orderBy('timestamp', 'desc').limit(10).get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting backups:', error);
    return [];
  }
}

// Utility functions
function isLicenseExpired(license) {
  if (!license.expiry) return false;
  return new Date() > new Date(license.expiry);
}

function isHWIDBanned(hwid, banlist) {
  return banlist.includes(hwid);
}

function generateSecureLicenseKey(prefix = 'LIC') {
  return `${prefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

// Enhanced auth middleware with role-based access control
function requireAuth(requiredRole = null) {
  return async (req, res, next) => {
    try {
      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Check if it's the main admin from environment variables
      if (req.session.user === CONFIG.ADMIN_USERNAME) {
        req.userRole = 'admin';
        return next();
      }

      // Check database user role
      const userSnapshot = await db.collection('users')
        .where('username', '==', req.session.user)
        .where('active', '==', true)
        .get();

      if (userSnapshot.empty) {
        return res.status(401).json({ error: 'User not found or inactive' });
      }

      const userData = userSnapshot.docs[0].data();
      req.userRole = userData.role;

      // Check if user has required role
      if (requiredRole && !hasPermission(userData.role, requiredRole)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json({ error: 'Authentication error' });
    }
  };
}

// Role hierarchy and permissions
function hasPermission(userRole, requiredRole) {
  const roleHierarchy = {
    'admin': ['admin', 'operator', 'viewer'],
    'operator': ['operator', 'viewer'],
    'viewer': ['viewer']
  };

  return roleHierarchy[userRole]?.includes(requiredRole) || false;
}

// API Routes

// Enhanced Auth routes with database user support
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    let isAuthenticated = false;
    let userRole = null;
    
    // First check if it's the main admin from environment variables
    if (username === CONFIG.ADMIN_USERNAME && password === CONFIG.ADMIN_PASSWORD) {
      isAuthenticated = true;
      userRole = 'admin';
    } else {
      // Check database users
      const userSnapshot = await db.collection('users')
        .where('username', '==', username)
        .where('active', '==', true)
        .get();
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        
        if (userData.password === hashedPassword) {
          isAuthenticated = true;
          userRole = userData.role;
          
          // Update last login
          await db.collection('users').doc(userSnapshot.docs[0].id).update({
            lastLogin: new Date().toISOString()
          });
        }
      }
    }
    
    if (isAuthenticated) {
      req.session.user = username;
      req.session.role = userRole;
      
      await logActivity('ADMIN_LOGIN', `User logged in successfully (${userRole})`, req.ip, req.get('User-Agent'), username);
      res.json({ success: true, message: 'Login successful', role: userRole });
    } else {
      await logActivity('ADMIN_LOGIN_FAILED', `Failed login attempt for username: ${username}`, req.ip, req.get('User-Agent'));
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    await logActivity('ADMIN_LOGIN_ERROR', `Login error for username: ${username}`, req.ip, req.get('User-Agent'));
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const user = req.session.user;
  req.session.destroy();
  await logActivity('ADMIN_LOGOUT', 'Admin logged out', req.ip, req.get('User-Agent'), user || 'unknown');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/auth/check', async (req, res) => {
  try {
    if (req.session && req.session.user) {
      // Check if it's the main admin
      if (req.session.user === CONFIG.ADMIN_USERNAME) {
        return res.json({ 
          authenticated: true, 
          user: req.session.user,
          role: 'admin'
        });
      }
      
      // Check if database user is still active
      const userSnapshot = await db.collection('users')
        .where('username', '==', req.session.user)
        .where('active', '==', true)
        .get();
      
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        return res.json({ 
          authenticated: true, 
          user: req.session.user,
          role: userData.role
        });
      }
    }
    
    res.json({ authenticated: false });
  } catch (error) {
    console.error('Auth check error:', error);
    res.json({ authenticated: false });
  }
});

// License management routes with role-based access
app.get('/api/licenses', requireAuth('viewer'), async (req, res) => {
  try {
    const licenses = await getLicenses();
    await logActivity('LICENSE_LIST_VIEWED', 'License list accessed', req.ip, req.get('User-Agent'), req.session.user);
    res.json(licenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch licenses' });
  }
});

app.post('/api/licenses', requireAuth('operator'), async (req, res) => {
  try {
    const { prefix, expiry, note, maxActivations = 1 } = req.body;
    const licenseKey = generateSecureLicenseKey(prefix);
    
    const licenseData = {
      createdAt: new Date().toISOString(),
      expiry: expiry || null,
      note: note || '',
      hwid: null,
      activatedAt: null,
      lastValidated: null,
      maxActivations,
      activationCount: 0,
      isActive: true,
      createdBy: req.session.user,
      userRole: req.userRole,
      history: [{
        action: "CREATED",
        date: new Date().toISOString(),
        details: "License created by admin",
        ip: req.ip,
        user: req.session.user,
        userRole: req.userRole
      }]
    };
    
    await saveLicense(licenseKey, licenseData);
    await logActivity('LICENSE_CREATED', `License created: ${licenseKey}`, req.ip, req.get('User-Agent'), req.session.user, {
      licenseKey,
      prefix,
      expiry,
      maxActivations,
      createdByRole: req.userRole
    });
    
    // Create notification
    await createNotification(req.session.user, 'license', 'New License Created', `License ${licenseKey} has been created successfully`, 'LICENSE');
    
    res.json({ success: true, licenseKey, data: licenseData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create license' });
  }
});

app.put('/api/licenses/:licenseKey', requireAuth('operator'), async (req, res) => {
  try {
    const { licenseKey } = req.params;
    const updates = req.body;
    
    const existing = await getLicense(licenseKey);
    if (!existing) {
      return res.status(404).json({ error: 'License not found' });
    }
    
    const updatedLicense = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: req.session.user,
      updatedByRole: req.userRole,
      history: [
        ...(existing.history || []),
        {
          action: "UPDATED",
          date: new Date().toISOString(),
          details: `License updated: ${Object.keys(updates).join(', ')}`,
          ip: req.ip,
          user: req.session.user,
          userRole: req.userRole
        }
      ]
    };
    
    await saveLicense(licenseKey, updatedLicense);
    await logActivity('LICENSE_UPDATED', `License updated: ${licenseKey}`, req.ip, req.get('User-Agent'), req.session.user, updates);
    
    res.json({ success: true, data: updatedLicense });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update license' });
  }
});

app.delete('/api/licenses/:licenseKey', requireAuth('admin'), async (req, res) => {
  try {
    const { licenseKey } = req.params;
    await deleteLicense(licenseKey);
    await logActivity('LICENSE_DELETED', `License deleted: ${licenseKey}`, req.ip, req.get('User-Agent'), req.session.user);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete license' });
  }
});

// User Management - Admin only
app.get('/api/users', requireAuth('admin'), async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      password: undefined
    }));
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', requireAuth('admin'), async (req, res) => {
  try {
    const { username, email, role } = req.body;
    
    // Check if username already exists
    const existingUser = await db.collection('users').where('username', '==', username).get();
    if (!existingUser.empty) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Check if email already exists
    const existingEmail = await db.collection('users').where('email', '==', email).get();
    if (!existingEmail.empty) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Generate temporary password
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = crypto.createHash('sha256').update(tempPassword).digest('hex');
    
    const userData = {
      username,
      email,
      role: role || 'operator',
      password: hashedPassword,
      active: true,
      lastLogin: null,
      createdAt: new Date().toISOString(),
      createdBy: req.session.user,
      createdByRole: req.userRole,
      tempPassword: true
    };
    
    const docRef = await db.collection('users').add(userData);
    
    await logActivity('USER_CREATED', `User created: ${username} with role: ${role}`, req.ip, req.get('User-Agent'), req.session.user, {
      userId: docRef.id,
      username,
      email,
      role,
      createdByRole: req.userRole
    });
    
    // Create notification for user creation
    await createNotification(req.session.user, 'system', 'New User Created', `User ${username} has been created with role: ${role}`, 'SYSTEM');
    
    res.json({ 
      success: true, 
      user: { id: docRef.id, ...userData, password: undefined },
      tempPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:userId/status', requireAuth('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;
    
    await db.collection('users').doc(userId).update({
      active,
      updatedAt: new Date().toISOString(),
      updatedBy: req.session.user,
      updatedByRole: req.userRole
    });
    
    await logActivity('USER_STATUS_CHANGED', `User status changed: ${active ? 'activated' : 'deactivated'}`, req.ip, req.get('User-Agent'), req.session.user, {
      userId,
      newStatus: active,
      changedByRole: req.userRole
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

app.post('/api/users/:userId/reset-password', requireAuth('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
    
    await db.collection('users').doc(userId).update({
      password: hashedPassword,
      tempPassword: false,
      passwordChangedAt: new Date().toISOString(),
      passwordChangedBy: req.session.user,
      passwordChangedByRole: req.userRole
    });
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    await logActivity('PASSWORD_RESET', `Password reset for user: ${userData.username}`, req.ip, req.get('User-Agent'), req.session.user, {
      userId,
      targetUser: userData.username,
      resetByRole: req.userRole
    });
    
    // Create notification
    await createNotification(req.session.user, 'security', 'Password Reset', `Password has been reset for user ${userData.username}`, 'SECURITY');
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

app.delete('/api/users/:userId', requireAuth('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    
    if (userData.username === req.session.user) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    await db.collection('users').doc(userId).delete();
    
    await logActivity('USER_DELETED', `User deleted: ${userData.username}`, req.ip, req.get('User-Agent'), req.session.user, {
      userId,
      deletedUser: userData.username,
      deletedByRole: req.userRole
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Enhanced Activity/Audit log with role-based filtering
app.get('/api/activity', requireAuth('viewer'), async (req, res) => {
  try {
    const { limit = 100, category, severity } = req.query;
    let activities = await getActivityLog(parseInt(limit), category, severity);
    
    // Viewers can only see their own activities
    if (req.userRole === 'viewer') {
      activities = activities.filter(activity => activity.userId === req.session.user);
    }
    
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity log' });
  }
});

app.get('/api/audit', requireAuth('admin'), async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const snapshot = await db.collection('auditTrail')
      .orderBy('timestamp', 'desc')
      .limit(parseInt(limit))
      .get();
    
    const auditLogs = snapshot.docs.map(doc => doc.data());
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit trail' });
  }
});

// Analytics endpoint - All roles can view
app.get('/api/analytics', requireAuth('viewer'), async (req, res) => {
  try {
    const analytics = await getSystemAnalytics();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// System settings - Admin only
app.get('/api/settings', requireAuth('admin'), async (req, res) => {
  try {
    const settings = await getSystemSettings();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.put('/api/settings', requireAuth('admin'), async (req, res) => {
  try {
    const success = await updateSystemSettings(req.body);
    if (success) {
      await logActivity('SYSTEM_SETTINGS_UPDATED', 'System settings updated', req.ip, req.get('User-Agent'), req.session.user, req.body);
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to update settings' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Backup endpoints - Admin only
app.post('/api/backup', requireAuth('admin'), async (req, res) => {
  try {
    const result = await createBackup();
    if (result.success) {
      await logActivity('BACKUP_CREATED', `Backup created: ${result.backupId}`, req.ip, req.get('User-Agent'), req.session.user);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create backup' });
  }
});

app.get('/api/backups', requireAuth('admin'), async (req, res) => {
  try {
    const backups = await getBackups();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch backups' });
  }
});

// Notification endpoints
app.get('/api/notifications', requireAuth('viewer'), async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.session.user)
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();
    
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/api/notifications/count', requireAuth('viewer'), async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.session.user)
      .where('read', '==', false)
      .get();
    
    res.json({ unread: snapshot.size });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get notification count' });
  }
});

app.patch('/api/notifications/:id/read', requireAuth('viewer'), async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({
      read: true,
      readAt: new Date().toISOString()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

app.patch('/api/notifications/mark-all-read', requireAuth('viewer'), async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.session.user)
      .where('read', '==', false)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: new Date().toISOString()
      });
    });
    
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
});

app.delete('/api/notifications', requireAuth('viewer'), async (req, res) => {
  try {
    const snapshot = await db.collection('notifications')
      .where('userId', '==', req.session.user)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear notifications' });
  }
});

// Banlist management with role-based access
app.get('/api/banlist', requireAuth('operator'), async (req, res) => {
  try {
    const banlist = await getBanlist();
    res.json(banlist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch banlist' });
  }
});

app.post('/api/banlist', requireAuth('operator'), async (req, res) => {
  try {
    const { hwid, reason = 'Manual ban' } = req.body;
    const banlist = await getBanlist();
    
    if (!banlist.includes(hwid)) {
      banlist.push(hwid);
      await saveBanlist(banlist);
      
      await db.collection('banDetails').doc(hwid).set({
        hwid,
        reason,
        bannedAt: new Date().toISOString(),
        bannedBy: req.session.user,
        bannedByRole: req.userRole,
        ip: req.ip
      });
      
      await logActivity('HWID_BANNED', `HWID banned: ${hwid}`, req.ip, req.get('User-Agent'), req.session.user, { hwid, reason, bannedByRole: req.userRole });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to ban HWID' });
  }
});

app.delete('/api/banlist/:hwid', requireAuth('admin'), async (req, res) => {
  try {
    const { hwid } = req.params;
    const banlist = await getBanlist();
    const updatedBanlist = banlist.filter(h => h !== hwid);
    await saveBanlist(updatedBanlist);
    
    await db.collection('banDetails').doc(hwid).delete();
    
    await logActivity('HWID_UNBANNED', `HWID unbanned: ${hwid}`, req.ip, req.get('User-Agent'), req.session.user);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unban HWID' });
  }
});

// Enhanced public API endpoints
app.get('/api/validate', async (req, res) => {
  const { license, hwid } = req.query;
  if (!license || !hwid) return res.send('FAILED');

  try {
    const settings = await getSystemSettings();
    if (settings.maintenanceMode) {
      return res.send('MAINTENANCE');
    }

    await logActivity('API_VALIDATE', `License validation: ${license} HWID: ${hwid}`, req.ip, req.get('User-Agent'));
    
    const banlist = await getBanlist();
    if (isHWIDBanned(hwid, banlist)) return res.send('BANNED');

    const lic = await getLicense(license);
    if (!lic) return res.send('INVALID_LICENSE');
    if (!lic.isActive) return res.send('DEACTIVATED');
    if (isLicenseExpired(lic)) return res.send('EXPIRED');

    if (lic.hwid === hwid) {
      await saveLicense(license, {
        ...lic,
        lastValidated: new Date().toISOString(),
        history: [
          ...(lic.history || []),
          {
            action: "VALIDATED",
            date: new Date().toISOString(),
            details: `License validated from ${req.ip}`,
            ip: req.ip
          }
        ]
      });
      return res.send('VALID');
    }

    return res.send('HWID_MISMATCH');
  } catch (error) {
    console.error('Validation error:', error);
    await logActivity('API_ERROR', `Validation error: ${error.message}`, req.ip, req.get('User-Agent'));
    return res.send('ERROR');
  }
});

app.get('/api/register', async (req, res) => {
  const { license, hwid } = req.query;
  if (!license || !hwid) return res.send('FAILED');

  try {
    const settings = await getSystemSettings();
    if (settings.maintenanceMode) {
      return res.send('MAINTENANCE');
    }

    if (!settings.registrationEnabled) {
      return res.send('REGISTRATION_DISABLED');
    }

    await logActivity('API_REGISTER', `License registration: ${license} HWID: ${hwid}`, req.ip, req.get('User-Agent'));
    
    const banlist = await getBanlist();
    if (isHWIDBanned(hwid, banlist)) return res.send('BANNED');

    const lic = await getLicense(license);
    if (!lic) return res.send('INVALID_LICENSE');
    if (!lic.isActive) return res.send('DEACTIVATED');
    if (isLicenseExpired(lic)) return res.send('EXPIRED');
    if (lic.hwid && lic.hwid !== hwid) return res.send('ALREADY_REGISTERED');

    // Check max activations
    if (lic.activationCount >= lic.maxActivations) {
      return res.send('MAX_ACTIVATIONS_REACHED');
    }

    const allLicenses = await getLicenses();
    for (const [licKey, licData] of Object.entries(allLicenses)) {
      if (licData.hwid === hwid && licKey !== license) {
        if (settings.maxLicensesPerHwid === 1) {
          return res.send('HWID_IN_USE');
        }
      }
    }

    const updatedLic = {
      ...lic,
      hwid: hwid,
      activatedAt: new Date().toISOString(),
      lastValidated: new Date().toISOString(),
      activationCount: (lic.activationCount || 0) + 1,
      activationIP: req.ip,
      deviceInfo: req.get('User-Agent') || 'Unknown',
      history: [...(lic.history || []), {
        action: "REGISTER",
        date: new Date().toISOString(),
        details: `License registered to HWID: ${hwid}`,
        ip: req.ip
      }]
    };

    await saveLicense(license, updatedLic);
    return res.send('SUCCESS');
  } catch (error) {
    console.error('Registration error:', error);
    await logActivity('API_ERROR', `Registration error: ${error.message}`, req.ip, req.get('User-Agent'));
    return res.send('ERROR');
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const performance = await getPerformanceMetrics();
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: performance.uptime,
      memory: performance.memoryUsage,
      system: performance.systemInfo
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

// Debug endpoint for development
app.get('/api/debug/users', requireAuth('admin'), async (req, res) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({ error: 'Not found' });
  }
  
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      email: doc.data().email,
      role: doc.data().role,
      active: doc.data().active,
      hasPassword: !!doc.data().password
    }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(CONFIG.PORT, () => {
  console.log(`🚀 Backend server running on port ${CONFIG.PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${CONFIG.FRONTEND_URL}`);
  console.log(`🔐 Role-based access control enabled`);
});
