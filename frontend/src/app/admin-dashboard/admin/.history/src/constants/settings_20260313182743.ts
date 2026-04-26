import { Settings } from '@/types/settings'

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'America/Honolulu',
  'America/Jamaica',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'Pacific/Auckland',
]

export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (12/31/2025)' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (31/12/2025)' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2025-12-31)' },
  { value: 'MMM D, YYYY', label: 'MMM D, YYYY (Dec 31, 2025)' },
  { value: 'D MMM YYYY', label: 'D MMM YYYY (31 Dec 2025)' },
]

export const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'JMD', label: 'Jamaican Dollar (J$)', symbol: 'J$' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
]

export const NOTIFICATION_EVENTS = [
  { id: 'newUser', label: 'New User Registration', category: 'users' },
  { id: 'userSuspended', label: 'User Suspended', category: 'users' },
  { id: 'newTherapist', label: 'New Therapist Application', category: 'therapists' },
  { id: 'therapistVerified', label: 'Therapist Verified', category: 'therapists' },
  { id: 'newSession', label: 'New Session Booked', category: 'sessions' },
  { id: 'sessionReminder', label: 'Session Reminder', category: 'sessions' },
  { id: 'sessionCancelled', label: 'Session Cancelled', category: 'sessions' },
  { id: 'newResource', label: 'New Resource Added', category: 'resources' },
  { id: 'resourceReported', label: 'Resource Reported', category: 'resources' },
  { id: 'paymentReceived', label: 'Payment Received', category: 'payments' },
  { id: 'paymentFailed', label: 'Payment Failed', category: 'payments' },
  { id: 'systemAlert', label: 'System Alert', category: 'system' },
  { id: 'maintenanceAlert', label: 'Maintenance Alert', category: 'system' },
]

export const BACKUP_FREQUENCIES = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

export const BACKUP_STORAGE = [
  { value: 'local', label: 'Local Storage' },
  { value: 's3', label: 'Amazon S3' },
  { value: 'gcs', label: 'Google Cloud Storage' },
  { value: 'azure', label: 'Azure Blob Storage' },
]

export const LOGGING_LEVELS = [
  { value: 'debug', label: 'Debug', color: 'gray' },
  { value: 'info', label: 'Info', color: 'blue' },
  { value: 'warn', label: 'Warning', color: 'yellow' },
  { value: 'error', label: 'Error', color: 'red' },
]

export const MOCK_SETTINGS: Settings = {
  general: {
    platformName: 'HopePath',
    platformUrl: 'https://hopepath.org',
    supportEmail: 'support@hopepath.org',
    supportPhone: '+1-876-555-HELP',
    address: '123 Hope Road, Kingston, Jamaica',
    timezone: 'America/Jamaica',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    weekStartsOn: 'sunday',
    logo: '/logo.png',
    logoDark: '/logo-dark.png',
  },
  
  security: {
    passwordMinLength: 8,
    passwordRequireNumbers: true,
    passwordRequireSymbols: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    sessionTimeout: 30,
    sessionTimeoutWarning: 5,
    twoFactorRequired: true,
    twoFactorEnforced: false,
    ipWhitelist: ['127.0.0.1', '192.168.1.0/24'],
    allowMultipleSessions: false,
    requireEmailVerification: true,
    emailVerificationExpiry: 24,
    requirePhoneVerification: false,
    recaptchaEnabled: true,
    recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
    recaptchaSecretKey: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
  },
  
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpSecure: true,
    smtpUser: 'noreply@hopepath.org',
    smtpPassword: '********',
    smtpFromEmail: 'noreply@hopepath.org',
    smtpFromName: 'HopePath',
    smtpReplyTo: 'support@hopepath.org',
    emailTemplate: 'branded',
    emailFooter: '© 2025 HopePath. All rights reserved.',
    emailLogo: '/email-logo.png',
    emailBrandColor: '#3b82f6',
    sendWelcomeEmail: true,
    sendPasswordResetEmail: true,
    sendSessionReminders: true,
    sendNewsletter: true,
    emailQueueEnabled: true,
    emailRateLimit: 1000,
  },
  
  notifications: {
    enablePushNotifications: true,
    vapidPublicKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U',
    vapidPrivateKey: '********',
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    notificationTypes: {
      newUser: true,
      userSuspended: true,
      newTherapist: true,
      therapistVerified: true,
      newSession: true,
      sessionReminder: true,
      sessionCancelled: true,
      newResource: true,
      resourceReported: true,
      paymentReceived: true,
      paymentFailed: true,
      systemAlert: true,
      maintenanceAlert: true,
    },
    notificationChannels: {
      email: ['admin@hopepath.org', 'support@hopepath.org'],
      sms: [],
      push: [],
      slack: 'https://hooks.slack.com/services/xxx/yyy/zzz',
    },
    notificationQuietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00',
      timezone: 'America/Jamaica',
    },
  },
  
  users: {
    allowRegistration: true,
    requireApproval: false,
    defaultUserRole: 'user',
    defaultUserStatus: 'active',
    allowSocialLogin: true,
    socialProviders: {
      google: true,
      facebook: false,
      apple: true,
      twitter: false,
    },
    socialApiKeys: {
      google: '123456789-abc123.apps.googleusercontent.com',
      apple: 'com.example.app',
    },
    profileFields: {
      phone: true,
      dateOfBirth: true,
      gender: true,
      address: false,
      emergencyContact: true,
      occupation: false,
      interests: true,
    },
    maxSessionsPerUser: 10,
    maxResourcesPerUser: 100,
    sessionBufferHours: 24,
    allowTherapistSelection: true,
  },
  
  payments: {
    currency: 'USD',
    currencySymbol: '$',
    currencyPosition: 'before',
    thousandSeparator: ',',
    decimalSeparator: '.',
    decimalPlaces: 2,
    
    stripeEnabled: true,
    stripePublicKey: 'pk_test_...',
    stripeSecretKey: 'sk_test_...',
    stripeWebhookSecret: 'whsec_...',
    
    paypalEnabled: false,
    squareEnabled: false,
    
    sessionPricing: {
      individual: 120,
      couples: 150,
      family: 200,
      group: 60,
    },
    
    premiumPricing: {
      monthly: 29.99,
      yearly: 299.99,
      lifetime: 999.99,
    },
    
    taxes: {
      enabled: true,
      taxRate: 15,
      taxInclusive: false,
    },
    
    discounts: {
      enabled: true,
      maxDiscountPercent: 50,
      allowCoupons: true,
      allowBulkDiscounts: true,
    },
    
    invoices: {
      enabled: true,
      prefix: 'INV',
      format: 'INV-{YYYY}-{MM}-{DD}-{NUMBER}',
      footer: 'Thank you for choosing HopePath.',
      logo: '/invoice-logo.png',
    },
  },
  
  integrations: {
    googleAnalyticsId: 'UA-123456789-1',
    googleTagManagerId: 'GTM-ABCDEF',
    facebookPixelId: '123456789012345',
    
    hubspotEnabled: false,
    salesforceEnabled: false,
    
    googleCalendarEnabled: true,
    googleCalendarApiKey: 'AIzaSy...',
    googleCalendarId: 'calendar@hopepath.org',
    
    outlookCalendarEnabled: false,
    
    slackWebhook: 'https://hooks.slack.com/services/xxx/yyy/zzz',
    twilioEnabled: false,
    
    openaiEnabled: false,
    claudeEnabled: false,
    
    awsEnabled: false,
    cloudinaryEnabled: true,
    cloudinaryCloudName: 'hopepath',
    cloudinaryApiKey: '123456789012345',
    cloudinaryApiSecret: '********',
  },
  
  backup: {
    enabled: true,
    frequency: 'daily',
    time: '02:00',
    retentionDays: 30,
    storage: 's3',
    storagePath: 's3://hopepath-backups',
    includeFiles: true,
    includeDatabase: true,
    includeLogs: true,
    notifyOnSuccess: true,
    notifyOnFailure: true,
    notificationEmails: ['admin@hopepath.org', 'tech@hopepath.org'],
    lastBackup: '2025-03-12T02:00:00Z',
    nextBackup: '2025-03-13T02:00:00Z',
    backupSize: 1572864000, // 1.5 GB
    backups: [
      {
        id: 'backup-001',
        date: '2025-03-12T02:00:00Z',
        size: 1572864000,
        type: 'full',
        status: 'success',
        location: 's3://hopepath-backups/2025-03-12-full.zip',
      },
      {
        id: 'backup-002',
        date: '2025-03-11T02:00:00Z',
        size: 1560281088,
        type: 'full',
        status: 'success',
        location: 's3://hopepath-backups/2025-03-11-full.zip',
      },
    ],
  },
  
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing scheduled maintenance. Please check back soon.',
    maintenanceAllowedIps: ['127.0.0.1', '192.168.1.100'],
    maintenanceAllowedRoles: ['admin', 'super_admin'],
    
    cacheEnabled: true,
    cacheDuration: 3600,
    cacheClearOnUpdate: true,
    
    loggingLevel: 'info',
    logRetention: 30,
    logFormat: 'json',
    
    rateLimiting: {
      enabled: true,
      maxRequests: 100,
      windowMs: 60000,
      whitelist: ['127.0.0.1'],
    },
    
    performanceMonitoring: true,
    errorTracking: true,
    sentryDsn: 'https://xxx@sentry.io/yyy',
    
    scheduledJobs: [
      {
        id: 'job-001',
        name: 'Daily Backup',
        schedule: '0 2 * * *',
        lastRun: '2025-03-12T02:00:00Z',
        nextRun: '2025-03-13T02:00:00Z',
        status: 'active',
        description: 'Perform daily system backup',
      },
      {
        id: 'job-002',
        name: 'Session Reminders',
        schedule: '*/15 * * * *',
        lastRun: '2025-03-12T10:45:00Z',
        nextRun: '2025-03-12T11:00:00Z',
        status: 'active',
        description: 'Send session reminder notifications',
      },
      {
        id: 'job-003',
        name: 'Cleanup Temp Files',
        schedule: '0 0 * * 0',
        lastRun: '2025-03-10T00:00:00Z',
        nextRun: '2025-03-17T00:00:00Z',
        status: 'active',
        description: 'Remove temporary files older than 7 days',
      },
    ],
  },
  
  api: {
    apiEnabled: true,
    apiUrl: 'https://api.hopepath.org/v1',
    apiVersion: 'v1',
    apiRateLimit: 1000,
    apiRateLimitWindow: 15,
    
    apiKeys: [
      {
        id: 'key-001',
        name: 'Mobile App',
        key: 'hp_live_xxxxxxxxxxxx',
        permissions: ['read:users', 'write:sessions', 'read:resources'],
        createdAt: '2025-01-01T00:00:00Z',
        createdBy: 'admin1',
        status: 'active',
        lastUsed: '2025-03-12T10:30:00Z',
      },
      {
        id: 'key-002',
        name: 'Webhook Client',
        key: 'hp_live_yyyyyyyyyyyy',
        permissions: ['read:webhooks', 'write:webhooks'],
        createdAt: '2025-02-15T00:00:00Z',
        createdBy: 'admin2',
        status: 'active',
      },
    ],
    
    webhooks: [
      {
        id: 'webhook-001',
        name: 'Slack Notifications',
        url: 'https://hooks.slack.com/services/xxx/yyy/zzz',
        events: ['user.created', 'session.created', 'payment.received'],
        status: 'active',
        createdAt: '2025-01-01T00:00:00Z',
        lastTriggered: '2025-03-12T10:45:00Z',
        failureCount: 0,
      },
    ],
    
    corsOrigins: ['https://hopepath.org', 'https://admin.hopepath.org'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    jwtExpiry: 86400,
    refreshTokenExpiry: 604800,
  },
}

export const MOCK_AUDIT_LOGS: SettingsAuditLog[] = [
  {
    id: 'log-001',
    userId: 'admin1',
    userName: 'Super Admin',
    action: 'update',
    section: 'security',
    setting: 'passwordMinLength',
    oldValue: 6,
    newValue: 8,
    ipAddress: '192.168.1.100',
    timestamp: '2025-03-12T09:30:00Z',
  },
  {
    id: 'log-002',
    userId: 'admin2',
    userName: 'John Doe',
    action: 'toggle',
    section: 'maintenance',
    setting: 'maintenanceMode',
    oldValue: false,
    newValue: true,
    ipAddress: '192.168.1.101',
    timestamp: '2025-03-12T10:15:00Z',
  },
  {
    id: 'log-003',
    userId: 'admin1',
    userName: 'Super Admin',
    action: 'update',
    section: 'payments',
    setting: 'sessionPricing.individual',
    oldValue: 100,
    newValue: 120,
    ipAddress: '192.168.1.100',
    timestamp: '2025-03-11T14:20:00Z',
  },
]