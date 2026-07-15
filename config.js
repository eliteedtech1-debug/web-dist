/**
 * Runtime Configuration for Elite Core
 * 
 * This file provides runtime configuration as a fallback when
 * environment variables are not available at build time.
 * 
 * Usage:
 * 1. Copy this file to public/config.js
 * 2. Update the values to match your deployment
 * 3. Add <script src="/config.js"></script> to index.html before the app loads
 */

window.__APP_CONFIG__ = {
  VITE_REACT_APP_SERVER_URL: 'https://server.brainstorm.ng/elite-api',
  REACT_APP_SERVER_URL: 'https://server.brainstorm.ng/elite-api',
  VITE_REACT_APP_PROD_SERVER_URL: 'https://server.brainstorm.ng/elite-api',
  REACT_APP_PROD_SERVER_URL: 'https://server.brainstorm.ng/elite-api',
  
  VITE_APP_NAME: 'ELITE CORE',
  APP_NAME: 'ELITE CORE',
  REACT_APP_APP_NAME: 'ELITE CORE',
  
  VITE_APP_LOGO: '/assets/img/elitescholar-logo.png',
  APP_LOGO: '/assets/img/elitescholar-logo.png',
  
  VITE_APP_SHORT_NAME: 'ELITECORE',
  APP_SHORT_NAME: 'ELITECORE',
  
  VITE_APP_URL: 'elitecore.com.ng',
  APP_URL: 'elitecore.com.ng',
  
  VITE_APP_DOMAIN: 'elitecore.com.ng',
  APP_DOMAIN: 'elitecore.com.ng',
  REACT_APP_DOMAIN: 'elitecore.com.ng',
  
  VITE_PRIMARY_COLOR: '#2563eb',
  PRIMARY_COLOR: '#2563eb',
  
  VITE_SECONDARY_COLOR: '#1e40af',
  SECONDARY_COLOR: '#1e40af',
  
  VITE_ACCENT_COLOR: '#3b82f6',
  ACCENT_COLOR: '#3b82f6',
  
  VITE_LOGIN_TITLE: 'ELITE CORE Education Platform',
  LOGIN_TITLE: 'ELITE CORE Education Platform',
  
  VITE_LOGIN_SUBTITLE: 'Admin, Staff & Parents SignIn',
  LOGIN_SUBTITLE: 'Admin, Staff & Parents SignIn',
  
  VITE_STUDENT_LOGIN_SUBTITLE: 'Student Portal Access',
  STUDENT_LOGIN_SUBTITLE: 'Student Portal Access',
  
  VITE_POWERED_BY_TEXT: 'Powered by Elite Edu Tech',
  POWERED_BY_TEXT: 'Powered by Elite Edu Tech',
  
  VITE_POWERED_BY_URL: 'https://elitecore.com.ng/',
  POWERED_BY_URL: 'https://elitecore.com.ng/',
  
  VITE_DEFAULT_SCHOOL_ID: '',
  DEFAULT_SCHOOL_ID: '',
  
  VITE_SHOW_SCHOOL_ID_FIELD: 'true',
  SHOW_SCHOOL_ID_FIELD: 'true',
  
  VITE_AUTO_DETECT_SCHOOL_FROM_SUBDOMAIN: 'true',
  AUTO_DETECT_SCHOOL_FROM_SUBDOMAIN: 'true',
  
  VITE_ENABLE_PWA: 'true',
  ENABLE_PWA: 'true',
  REACT_APP_ENABLE_PWA: 'true',
  
  VITE_ENABLE_OFFLINE_MODE: 'true',
  ENABLE_OFFLINE_MODE: 'true',
  
  VITE_ENABLE_NOTIFICATIONS: 'true',
  ENABLE_NOTIFICATIONS: 'true',
  
  NODE_ENV: 'production',
  REACT_APP_ENV: 'production'
};

console.log('✅ Runtime configuration loaded');
console.log('🌐 API Server:', window.__APP_CONFIG__.VITE_REACT_APP_SERVER_URL);
console.log('🏷️  App Name:', window.__APP_CONFIG__.VITE_APP_NAME);
