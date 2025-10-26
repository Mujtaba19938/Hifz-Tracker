# Admin Login & Dashboard Setup Guide

## 🚀 Quick Start

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `config.env` and update with your MongoDB URI and JWT secret
   - Ensure `JWT_SECRET` is set for token generation

4. **Seed the default admin user:**
   ```bash
   node seedAdmin.js
   ```
   This creates a default admin user with:
   - Username: `admin`
   - Password: `admin123`

5. **Start the backend server:**
   ```bash
   npm start
   ```

### 2. Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

## 🔐 Admin Login Flow

### Default Credentials
- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Important:** Change these credentials immediately after first login!

### Login Process
1. Open the app and go to the Sign In screen
2. Click the "Login as Admin" button (🔒 icon)
3. A popup will show the default credentials for 3 seconds
4. After the popup closes, the form switches to admin login mode
5. Enter the credentials and click "Admin Login"
6. You'll be redirected to the Admin Dashboard

## 🎛️ Admin Dashboard Features

### 1. Header Section
- App logo and title
- Welcome message in both English and Urdu
- Logout button (top right)

### 2. Summary Statistics
- Total Teachers count
- Total Students count  
- Total Classes count
- Displayed in a responsive grid layout

### 3. Update Credentials Section
- Click the "Change Credentials" button (🔒 icon)
- Form fields for:
  - Old Username
  - Old Password
  - New Username
  - New Password
- Submit to update admin credentials

## 🌐 Bilingual Support

The admin interface supports both English and Urdu:
- All text automatically switches based on language preference
- RTL (Right-to-Left) layout for Urdu
- Consistent with the rest of the app's language system

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/login` - Regular user login

### Admin Operations
- `PUT /api/admin/update-credentials` - Update admin credentials
- `GET /api/admin/dashboard-stats` - Get dashboard statistics

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Admin-only endpoints protected with middleware
- Secure credential validation

## 📱 Navigation Flow

```
Sign In Screen
    ↓ (Admin Login)
Admin Dashboard
    ↓ (Logout)
Sign In Screen
```

## 🎨 UI/UX Features

- Consistent design with app theme
- Gradient backgrounds
- Smooth animations
- Responsive layout
- Success/error popups
- Loading states
- Form validation

## 🔄 Future Enhancements

Potential features to add:
- User management (add/edit/delete teachers/students)
- Class management
- Reports and analytics
- System settings
- Backup/restore functionality
- Audit logs

## 🐛 Troubleshooting

### Common Issues

1. **Admin login fails:**
   - Ensure backend server is running
   - Check if admin user exists in database
   - Verify credentials are correct

2. **Navigation issues:**
   - Check if admin-dashboard route is registered
   - Verify user role is set correctly

3. **Translation issues:**
   - Ensure all translation keys are added
   - Check language context is working

### Debug Steps

1. Check browser/app console for errors
2. Verify API endpoints are accessible
3. Check database connection
4. Validate JWT token generation

## 📞 Support

For issues or questions:
1. Check the console logs
2. Verify all dependencies are installed
3. Ensure environment variables are set correctly
4. Check MongoDB connection

---

**Note:** This is a development setup. For production, ensure proper security measures, environment variables, and database configurations are in place.
