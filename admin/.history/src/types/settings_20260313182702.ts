export interface GeneralSettings {
  platformName: string
  platformUrl: string
  supportEmail: string
  supportPhone?: string
  address?: string
  timezone: string
  dateFormat: string
  timeFormat: '12h' | '24h'
  weekStartsOn: 'monday' | 'sunday'
  favicon?: string
  logo?: string
  logoDark?: string
  faviconDark?: string
}

export interface SecuritySettings {
  passwordMinLength: number
  passwordRequireNumbers: boolean
  passwordRequireSymbols: boolean
  passwordRequireUppercase: boolean
  maxLoginAttempts: number
  lockoutDuration: number // minutes
  sessionTimeout: number // minutes
  sessionTimeoutWarning: number // minutes
  twoFactorRequired: boolean
  twoFactorEnforced: boolean
  ipWhitelist: string[]
  allowMultipleSessions: boolean
  requireEmailVerification: boolean
  emailVerificationExpiry: number // hours
  requirePhoneVerification: boolean
  recaptchaEnabled: boolean
  recaptchaSiteKey?: string
  recaptchaSecretKey?: string
}

export interface EmailSettings {
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUser: string
  smtpPassword: string
  smtpFromEmail: string
  smtpFromName: string
  smtpReplyTo?: string
  emailTemplate: 'default' | 'branded' | 'custom'
  emailFooter: string
  emailLogo?: string
  emailBrandColor: string
  testEmail?: string
  sendWelcomeEmail: boolean
  sendPasswordResetEmail: boolean
  sendSessionReminders: boolean
  sendNewsletter: boolean
  emailQueueEnabled: boolean
  emailRateLimit: number // per hour
}

export interface NotificationSettings {
  enablePushNotifications: boolean
  vapidPublicKey?: string
  vapidPrivateKey?: string
  enableEmailNotifications: boolean
  enableSmsNotifications: boolean
  notificationTypes: {
    newUser: boolean
    userSuspended: boolean
    newTherapist: boolean
    therapistVerified: boolean
    newSession: boolean
    sessionReminder: boolean
    sessionCancelled: boolean
    newResource: boolean
    resourceReported: boolean
    paymentReceived: boolean
    paymentFailed: boolean
    systemAlert: boolean
    maintenanceAlert: boolean
  }
  notificationChannels: {
    email: string[]
    sms: string[]
    push: string[]
    slack?: string
    discord?: string
    webhook?: string
  }
  notificationQuietHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
}

export interface UserSettings {
  allowRegistration: boolean
  requireApproval: boolean
  defaultUserRole: 'user' | 'premium'
  defaultUserStatus: 'active' | 'pending'
  allowSocialLogin: boolean
  socialProviders: {
    google: boolean
    facebook: boolean
    apple: boolean
    twitter: boolean
  }
  socialApiKeys: {
    google?: string
    facebook?: string
    apple?: string
    twitter?: string
  }
  profileFields: {
    phone: boolean
    dateOfBirth: boolean
    gender: boolean
    address: boolean
    emergencyContact: boolean
    occupation: boolean
    interests: boolean
  }
  maxSessionsPerUser: number
  maxResourcesPerUser: number
  sessionBufferHours: number // hours between sessions
  allowTherapistSelection: boolean
}

export interface PaymentSettings {
  currency: string
  currencySymbol: string
  currencyPosition: 'before' | 'after'
  thousandSeparator: string
  decimalSeparator: string
  decimalPlaces: number
  
  // Payment Gateways
  stripeEnabled: boolean
  stripePublicKey?: string
  stripeSecretKey?: string
  stripeWebhookSecret?: string
  
  paypalEnabled: boolean
  paypalClientId?: string
  paypalSecretKey?: string
  paypalWebhookId?: string
  
  squareEnabled: boolean
  squareApplicationId?: string
  squareAccessToken?: string
  squareLocationId?: string
  
  // Pricing
  sessionPricing: {
    individual: number
    couples: number
    family: number
    group: number
  }
  
  premiumPricing: {
    monthly: number
    yearly: number
    lifetime?: number
  }
  
  taxes: {
    enabled: boolean
    taxRate: number
    taxInclusive: boolean
    taxId?: string
  }
  
  discounts: {
    enabled: boolean
    maxDiscountPercent: number
    allowCoupons: boolean
    allowBulkDiscounts: boolean
  }
  
  invoices: {
    enabled: boolean
    prefix: string
    format: string
    footer: string
    logo?: string
  }
}

export interface IntegrationSettings {
  // Analytics
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  
  // CRM
  hubspotEnabled: boolean
  hubspotApiKey?: string
  
  salesforceEnabled: boolean
  salesforceClientId?: string
  salesforceClientSecret?: string
  salesforceUsername?: string
  salesforcePassword?: string
  salesforceSecurityToken?: string
  
  // Calendar
  googleCalendarEnabled: boolean
  googleCalendarApiKey?: string
  googleCalendarId?: string
  
  outlookCalendarEnabled: boolean
  outlookCalendarClientId?: string
  outlookCalendarClientSecret?: string
  
  // Communication
  slackWebhook?: string
  discordWebhook?: string
  twilioEnabled: boolean
  twilioAccountSid?: string
  twilioAuthToken?: string
  twilioPhoneNumber?: string
  
  // AI/ML
  openaiEnabled: boolean
  openaiApiKey?: string
  
  claudeEnabled: boolean
  claudeApiKey?: string
  
  // Storage
  awsEnabled: boolean
  awsAccessKey?: string
  awsSecretKey?: string
  awsRegion?: string
  awsBucket?: string
  
  cloudinaryEnabled: boolean
  cloudinaryCloudName?: string
  cloudinaryApiKey?: string
  cloudinaryApiSecret?: string
}

export interface BackupSettings {
  enabled: boolean
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  time: string // HH:mm format
  retentionDays: number
  storage: 'local' | 's3' | 'gcs' | 'azure'
  storagePath?: string
  includeFiles: boolean
  includeDatabase: boolean
  includeLogs: boolean
  notifyOnSuccess: boolean
  notifyOnFailure: boolean
  notificationEmails: string[]
  lastBackup?: string
  nextBackup?: string
  backupSize?: number
  backups: Array<{
    id: string
    date: string
    size: number
    type: 'full' | 'incremental'
    status: 'success' | 'failed' | 'in-progress'
    location: string
  }>
}

export interface MaintenanceSettings {
  maintenanceMode: boolean
  maintenanceMessage?: string
  maintenanceEndTime?: string
  maintenanceAllowedIps: string[]
  maintenanceAllowedRoles: string[]
  
  cacheEnabled: boolean
  cacheDuration: number // seconds
  cacheClearOnUpdate: boolean
  
  loggingLevel: 'debug' | 'info' | 'warn' | 'error'
  logRetention: number // days
  logFormat: 'json' | 'text'
  
  rateLimiting: {
    enabled: boolean
    maxRequests: number
    windowMs: number // milliseconds
    whitelist: string[]
  }
  
  performanceMonitoring: boolean
  errorTracking: boolean
  sentryDsn?: string
  
  scheduledJobs: Array<{
    id: string
    name: string
    schedule: string // cron expression
    lastRun?: string
    nextRun?: string
    status: 'active' | 'paused'
    description: string
  }>
}

export interface ApiSettings {
  apiEnabled: boolean
  apiUrl: string
  apiVersion: string
  apiRateLimit: number
  apiRateLimitWindow: number // minutes
  
  apiKeys: Array<{
    id: string
    name: string
    key: string
    secret?: string
    permissions: string[]
    expiresAt?: string
    lastUsed?: string
    createdBy: string
    createdAt: string
    status: 'active' | 'revoked'
  }>
  
  webhooks: Array<{
    id: string
    name: string
    url: string
    events: string[]
    secret?: string
    status: 'active' | 'inactive'
    lastTriggered?: string
    failureCount: number
    createdAt: string
  }>
  
  corsOrigins: string[]
  allowedMethods: string[]
  jwtSecret?: string
  jwtExpiry: number // seconds
  refreshTokenExpiry: number // seconds
}

export interface Settings {
  general: GeneralSettings
  security: SecuritySettings
  email: EmailSettings
  notifications: NotificationSettings
  users: UserSettings
  payments: PaymentSettings
  integrations: IntegrationSettings
  backup: BackupSettings
  maintenance: MaintenanceSettings
  api: ApiSettings
}

export interface SettingsAuditLog {
  id: string
  userId: string
  userName: string
  action: 'update' | 'delete' | 'create' | 'toggle'
  section: string
  setting: string
  oldValue?: any
  newValue?: any
  ipAddress?: string
  timestamp: string
}