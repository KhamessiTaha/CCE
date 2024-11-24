      
 # CCEditor 💻 

![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A real-time, full-stack collaborative code editor built with React and Firebase. Create coding rooms, collaborate with others, and write code together in real-time. Perfect for pair programming, teaching, and remote collaboration.

[View Demo](https://cceditor-e1b05.web.app/) · [Report Bug](https://github.com/khamessitaha/cce/issues) · [Request Feature](https://github.com/khamessitaha/cce/issues)

## ✨ Features

- **🔄 Real-Time Collaboration**
  - Instant code synchronization between users
  - Live cursors and selections
  - No lag or delays

- **🔒 Secure Room Management**
  - Create public or private rooms
  - Unique room IDs
  - Customizable access controls

- **👥 User System**
  - Google authentication integration
  - Guest access available
  - Multiple permission levels

- **💬 Communication Tools**
  - Built-in chat system
  - Activity notifications
  - User presence indicators

- **⚙️ Customization**
  - Multiple editor themes
  - Language syntax highlighting
  - Adjustable font settings
  - Configurable keybindings

## 🚀 Live Demo

Try the live demo: [Collaborative Code Editor Demo](https://cceditor-e1b05.web.app)

## 🔧 Tech Stack

- **Frontend**
  - React.js
  - CodeMirror 6
  - Material-UI

- **Backend**
  - Firebase
    - Firestore
    - Authentication
    - Hosting

## 📋 Prerequisites

- Node.js >= 14.x
- npm >= 6.x
- Firebase account
- Google Cloud Platform account (for authentication)

## 💻 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/khamessitaha/cce.git
   cd cce
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server
   ```bash
   npm start
   ```

## 🔑 Usage

1. **Login/Signup and Create a Room**
   - Login/Signup and navigate to your dahsboard
   - Click "New Room" on the dashboard
   - Choose room settings (public/private)
   - Share the room ID with collaborators

3. **Joining a Room**
   - Enter room ID 
   - Start collaborating!


## 🚀 Deployment

1. Install Firebase CLI
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase
   ```bash
   firebase login
   ```

3. Initialize Firebase
   ```bash
   firebase init
   ```

4. Build the project
   ```bash
   npm run build
   ```

5. Deploy to Firebase
   ```bash
   firebase deploy
   ```

## 📝 Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable Authentication and Firestore
3. Add your web app to the project
4. Copy the configuration to your `.env` file

### Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Your Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📧 Contact

Taha Khamessi - [@Instagram](https://www.instagram.com/quantumquasar24/) - taha.khamessi@gmail.com

Project Link: [https://github.com/khamessitaha/cce](https://github.com/khamessitaha/cce)

## 🙏 Acknowledgments

* [React.js](https://reactjs.org)
* [Firebase](https://firebase.google.com)
* [CodeMirror](https://codemirror.net)
* [Material-UI](https://mui.com)
