# Hifz Tracker Backend

A robust Node.js/Express backend for the Hifz Tracker application with MongoDB Atlas integration, automatic IP detection, and comprehensive error handling.

## 🚀 Features

- **Auto-Configuration**: Automatic IP detection and environment setup
- **MongoDB Integration**: Robust connection with automatic retry and reconnection
- **Authentication**: JWT-based authentication for admin, teacher, and student roles
- **API Retry Logic**: Automatic retry for failed requests with exponential backoff
- **CORS Configuration**: Properly configured for Expo development
- **Error Handling**: Comprehensive error handling and logging
- **User Management**: Complete CRUD operations for users and students

## 📁 Project Structure

```
backend/
├── middleware/          # Authentication middleware
├── models/             # MongoDB models (User, Student)
├── routes/             # API routes (auth, admin, attendance, etc.)
├── utils/              # Utility functions (IP detection)
├── scripts/            # Environment configuration scripts
├── server.js           # Main server file
├── package.json        # Dependencies and scripts
└── .env               # Environment variables
```

## 🛠️ Installation

1. **Clone the repository**
```bash
   git clone https://github.com/Mujtaba19938/Hifz-Tracker-Backend.git
   cd Hifz-Tracker-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Update .env with your MongoDB URI and JWT secret
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Seed the admin user**
   ```bash
   node seedAdmin.js
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Environment Configuration

The backend includes automatic IP detection and environment configuration:

   ```bash
# Auto-configure environment with detected IP
npm run update-env

# Start with auto-configuration
npm run dev
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login
- `POST /api/auth/student-login` - Student login
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/add-teacher` - Add new teacher
- `POST /api/admin/add-student` - Add new student
- `DELETE /api/admin/users/:id` - Delete user

### Health Check
- `GET /api/health` - Server health status

## 🔐 Default Admin Credentials

- **Email**: `admin@hifztracker.com`
- **Password**: `admin123`

⚠️ **Important**: Change these credentials after first login!

## 🗄️ Database Models

### User Model
- `name` - User's full name
- `email` - Unique email address
- `phoneNumber` - Phone number (optional for students)
- `password` - Hashed password
- `role` - User role (admin, teacher, student)
- `isActive` - Account status
- `masjidInfo` - Mosque information (for teachers/admins)
- `studentInfo` - Student information (for students)

### Student Model
- `name` - Student's name
- `urduName` - Student's name in Urdu
- `class` - Student's class
- `section` - Student's section
- `studentId` - Unique student ID
- `teacherId` - Assigned teacher
- `isActive` - Student status

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🔧 Scripts

- `npm start` - Start the server
- `npm run dev` - Start with auto-configuration
- `npm run update-env` - Update environment configuration
- `npm run seed-admin` - Create default admin user

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB Atlas connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ for the Hifz Tracker application**