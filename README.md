# 🚀 Full-Stack MERN Application

A production-ready full-stack web application built with **Next.js 15**, **TypeScript**, **MongoDB Atlas**, and **NextAuth.js**. Features comprehensive authentication, role-based access control (RBAC), email services, and admin management capabilities.

## ✨ Features

### 🔐 Authentication & Security
- **NextAuth.js** with multiple providers (Credentials, Google OAuth)
- **Role-Based Access Control (RBAC)** with admin and user roles
- **JWT tokens** and secure session management
- **Password reset** with email verification
- **Account selection** for Google OAuth
- **Audit logging** for security events

### 📧 Email Services
- **Gmail SMTP integration** with Nodemailer
- **Password reset emails** with secure tokens
- **Admin notification system**
- **Real-time email delivery**

### 👥 User Management
- **User registration** with admin key support
- **Admin dashboard** for user management
- **User promotion/demotion** capabilities
- **Real-time user status** monitoring
- **Comprehensive audit trails**

### 🎨 Modern UI/UX
- **Tailwind CSS** for responsive design
- **Gradient backgrounds** and modern components
- **Loading states** and error handling
- **Mobile-responsive** layout
- **Dark/light theme** support

### 🧪 Testing & Monitoring
- **System test suite** for comprehensive validation
- **Database health monitoring**
- **API endpoint testing**
- **Performance metrics**

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js 15, React 18, TypeScript |
| **Styling** | Tailwind CSS |
| **Authentication** | NextAuth.js |
| **Database** | MongoDB Atlas |
| **Email** | Nodemailer (Gmail SMTP) |
| **Deployment** | Vercel Ready |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **MongoDB Atlas account**
- **Google Cloud Console account** (for OAuth)
- **Gmail account** (for email services)

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd full-stack-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3001

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service Configuration (Gmail SMTP)
EMAIL_SERVICE=nodemailer
EMAIL_FROM=your-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Admin Registration Key
ADMIN_REGISTRATION_KEY=SuperAdmin2025!SecureKey

# Optional: Slack & Admin Alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
ADMIN_ALERT_EMAIL=admin@yourapp.com
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 🔧 Detailed Setup Instructions

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create database user credentials
   - Whitelist your IP address (or use 0.0.0.0/0 for development)

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your credentials

### Google OAuth Setup

1. **Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API

2. **Create OAuth Credentials**
   - Go to APIs & Services > Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URIs:
     - `http://localhost:3001/api/auth/callback/google`
     - `https://yourdomain.com/api/auth/callback/google` (for production)

### Gmail SMTP Setup

1. **Enable 2-Factor Authentication**
   - Go to your Google Account settings
   - Enable 2-factor authentication

2. **Generate App Password**
   - Go to Google Account > Security > 2-Step Verification
   - Generate app password for "Mail"
   - Use this password in `SMTP_PASS`

### NextAuth Secret Generation

```bash
openssl rand -base64 32
```

## 📖 Usage Guide

### 🎯 User Registration

#### Standard User Registration
1. Navigate to `/register`
2. Fill in name, email, and password
3. Submit form
4. Check email for verification (if enabled)

#### Admin User Registration
1. Navigate to `/register`
2. Fill in standard information
3. Click "Register as admin?"
4. Enter admin key: `SuperAdmin2025!SecureKey`
5. Submit form

### 🔑 Authentication

#### Email/Password Login
1. Navigate to `/login`
2. Enter email and password
3. Click "Sign in"

#### Google OAuth Login
1. Navigate to `/login`
2. Click "Continue with Google"
3. Select Google account
4. Authorize application

### 👑 Admin Functions

#### User Management
- **View Users**: `/admin/users`
- **Promote Users**: `/make-admin`
- **View Audit Logs**: `/admin/audit`

#### System Monitoring
- **System Tests**: `/system-test`
- **Current Users**: `/current-users`
- **Database Status**: Check homepage

### 📧 Password Reset

1. Navigate to `/reset`
2. Enter email address
3. Check email for reset link
4. Click link and enter new password

## 🧪 Testing

### System Test Suite

Navigate to `/system-test` to run comprehensive tests:

- ✅ Authentication Status
- ✅ Session Validation
- ✅ Database Connection
- ✅ Admin API Access
- ✅ Email System
- ✅ Middleware Protection

### Manual Testing Checklist

- [ ] User registration (standard)
- [ ] User registration (admin)
- [ ] Email/password login
- [ ] Google OAuth login
- [ ] Password reset flow
- [ ] Admin user promotion
- [ ] Role-based page access
- [ ] Email delivery
- [ ] Database operations

## 📁 Project Structure

```
full-stack-app/
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   ├── register/      # User registration
│   │   │   ├── reset/         # Password reset
│   │   │   ├── admin/         # Admin APIs
│   │   │   └── db-test/       # Database testing
│   │   ├── admin/             # Admin pages
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # User dashboard
│   │   └── system-test/       # Testing suite
│   ├── components/            # Reusable components
│   │   ├── NavBar.tsx
│   │   ├── UserMenu.tsx
│   │   ├── DatabaseStatus.tsx
│   │   └── Providers.tsx
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── mongodb.ts        # Database connection
│   │   └── email.ts          # Email services
│   └── types/                # TypeScript definitions
├── public/                   # Static assets
├── .env.local               # Environment variables
├── package.json            # Dependencies
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.ts         # Next.js configuration
```

## 🔒 Security Features

### Authentication Security
- **Secure password hashing** with bcrypt
- **JWT token validation**
- **Session management** with NextAuth
- **CSRF protection**
- **Rate limiting** (can be added)

### RBAC Implementation
- **Role-based middleware** protection
- **Admin-only API endpoints**
- **Dynamic navigation** based on roles
- **Audit logging** for sensitive actions

### Data Protection
- **Environment variable** security
- **Database connection** encryption
- **Email verification** for password reset
- **Secure token generation**

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect GitHub repository
   - Add environment variables
   - Deploy automatically

3. **Update OAuth Settings**
   - Add production URL to Google OAuth settings
   - Update `NEXTAUTH_URL` in environment

### Environment Variables for Production

```env
NEXTAUTH_URL=https://yourdomain.com
MONGODB_URI=your-production-mongodb-uri
# ... other variables remain same
```

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Failed
- ✅ Check MongoDB Atlas whitelist
- ✅ Verify connection string format
- ✅ Check username/password
- ✅ Ensure network access

#### Google OAuth Not Working
- ✅ Verify OAuth credentials
- ✅ Check redirect URIs
- ✅ Enable Google+ API
- ✅ Check domain verification

#### Email Not Sending
- ✅ Verify Gmail app password
- ✅ Check SMTP settings
- ✅ Ensure 2FA enabled
- ✅ Check firewall settings

#### Admin Access Issues
- ✅ Verify admin role in database
- ✅ Sign out and sign back in
- ✅ Check session refresh
- ✅ Verify middleware configuration

### Debug Commands

```bash
# Check database connection
curl http://localhost:3001/api/db-test

# Test email endpoint
curl -X POST http://localhost:3001/api/reset \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Check session
curl http://localhost:3001/api/auth/session
```

## 📊 Performance & Monitoring

### Built-in Monitoring
- **Database connection status** on homepage
- **System test suite** for health checks
- **Audit logs** for user actions
- **Error boundaries** for graceful failures

### Performance Features
- **Next.js 15** optimizations
- **Static generation** where possible
- **Image optimization**
- **Code splitting** automatic
- **Tailwind CSS** purging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: Check this README.md
- **Issues**: Create GitHub issue
- **Testing**: Use `/system-test` endpoint
- **Monitoring**: Check `/admin/audit` for logs

## 🎉 Acknowledgments

- **Next.js** team for the amazing framework
- **NextAuth.js** for authentication solutions
- **MongoDB** for database services
- **Tailwind CSS** for styling framework
- **Vercel** for hosting and deployment

---

**Built with ❤️ using Next.js 15, TypeScript, and MongoDB Atlas**

**Ready for production deployment! 🚀**
#   M E R N _ F U L L _ S T A C K _ A P P  
 #   M E R N _ F U L L _ S T A C K _ P R O J E C T  
 #   F u l l _ S t a c k _ M E R N _ P r o j e c t  
 #   M E R N _ F U L L _ S T A C K _ P R O J E C T _ 1  
 #   f u l l _ s t a c k  
 #   t e m p  
 