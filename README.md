# LuminaAI - Intelligence, Illuminated

A modern AI-powered chat application built with React and Node.js, featuring user authentication and multiple AI model integrations.

## 🚀 Features

- **AI-Powered Chat**: Integrated with OpenAI and Google Generative AI models
- **User Authentication**: Secure authentication powered by Clerk
- **Real-time Chat Interface**: Modern, responsive chat UI
- **Dark/Light Theme Support**: Theme switching capabilities
- **User Session Management**: Persistent chat history and user sessions
- **MongoDB Integration**: Reliable data storage for chat history
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Clerk React** - Authentication and user management
- **React Markdown** - Markdown rendering for AI responses
- **React Spinners** - Loading indicators
- **Rehype Highlight** - Code syntax highlighting

### Backend
- **Node.js** with **Express.js** - Server framework
- **MongoDB** with **Mongoose** - Database and ODM
- **Clerk SDK** - Backend authentication
- **OpenAI API** - GPT model integration
- **Google Generative AI** - Gemini model integration
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB database (local or cloud)
- Clerk account for authentication
- OpenAI API key
- Google AI API key

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd LuminaAI
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
GOOGLE_AI_API_KEY=your_google_ai_api_key
PORT=8080
```

### Frontend Configuration

Make sure to configure your Clerk publishable key in the frontend configuration files.

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**:
   ```bash
   cd backend
   npm run dev
   # or
   node server.js
   ```
   The backend server will start on `http://localhost:8080`

2. **Start the Frontend Development Server**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (or the next available port)

### Production Build

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Preview Production Build**:
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
LuminaAI/
├── backend/
│   ├── server.js              # Express server setup
│   ├── routes/
│   │   └── chat.js           # Chat API routes
│   ├── package.json
│   └── .env                  # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # Main application component
│   │   ├── Chat.jsx          # Chat interface component
│   │   ├── ChatWindow.jsx    # Chat window component
│   │   ├── Sidebar.jsx       # Sidebar component
│   │   ├── AuthPage.jsx      # Authentication page
│   │   ├── MyContext.jsx     # React context for state management
│   │   ├── ThemeContext.jsx  # Theme management
│   │   └── config.js         # Configuration file
│   ├── public/
│   │   └── blacklogo.png     # Application logo
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔐 Authentication

This application uses Clerk for authentication. Users need to:

1. Sign up or sign in through the authentication interface
2. Once authenticated, they can access the chat functionality
3. User sessions are managed automatically by Clerk

## 💬 Usage

1. **Sign Up/Sign In**: Create an account or sign in using the authentication interface
2. **Start Chatting**: Once authenticated, you can start conversations with the AI
3. **Multiple Models**: The application supports both OpenAI and Google Generative AI models
4. **Chat History**: Your conversations are saved and can be accessed later
5. **Theme Toggle**: Switch between light and dark themes as needed

## 🔧 API Endpoints

- `POST /api/chat` - Send messages to AI and receive responses
- Authentication is handled through Clerk middleware

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for providing the GPT API
- Google for Generative AI capabilities
- Clerk for authentication services
- The React and Node.js communities

## 📞 Support

If you encounter any issues or have questions, please:

1. Check the existing issues in the repository
2. Create a new issue with detailed information about the problem
3. Include steps to reproduce the issue

---

**LuminaAI** - Where intelligence meets illumination ✨
