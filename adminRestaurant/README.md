# Restaurant Admin Dashboard

A modern, feature-rich administration dashboard for restaurant management built with React and NextUI.

## 🚀 Features

- 🏪 Multi-merchant Management
- 🍽️ Menu & Dish Management
- 📱 Responsive Design
- 🔐 Secure Authentication
- 🎨 Modern UI/UX
- 🌙 Dark Mode Support
- 📊 Real-time Analytics
- 🔄 State Management
- 🌐 API Integration

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **UI Components**: NextUI
- **Styling**: Tailwind CSS
- **State Management**: Custom Store
- **Authentication**: Firebase Auth
- **HTTP Client**: Axios
- **Routing**: React Router
- **Icons**: React Icons

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/admin-restaurant.git
cd adminRestaurant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Navigation/          # Navigation components
│   ├── screens/             # Screen-specific components
│   └── shared/              # Shared/common components
├── routes/                  # Route configurations
├── stores/                  # State management
├── lib/                     # Utilities and helpers
├── services/               # API services
└── assets/                 # Static assets
```

## 🧩 Key Components

### Navigation
- **SiteHeader**: Main navigation component with merchant selection and user profile
- **MobileNav**: Responsive navigation for mobile devices
- **ProfileDrawer**: User profile management interface

### Screens
- **Dishes**: Complete dish management system
  - DishTable: Interactive table for dish listing
  - EditDishDialog: Form for dish creation/editing
  - ImageCell: Custom cell for dish images
  - DishesColumns: Table column configurations

### Features
- **Multi-merchant Support**: Switch between different restaurant accounts
- **Real-time Updates**: Instant UI updates on data changes
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System-wide theme support
- **Form Validation**: Comprehensive input validation
- **Error Handling**: Graceful error management
- **Loading States**: Smooth loading experiences

## 🔒 Security Features

- Firebase Authentication integration
- Protected routes
- Token-based API requests
- Secure merchant data handling
- XSS protection
- CORS configuration

## 🎨 UI/UX Features

- Modern, clean interface
- Responsive design
- Interactive components
- Loading states
- Error feedback
- Toast notifications
- Modal dialogs
- Form validation
- Smooth animations

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interfaces
- Adaptive navigation
- Flexible grids
- Responsive images

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=your_api_url
REACT_APP_FIREBASE_CONFIG=your_firebase_config
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication
3. Add Firebase configuration to environment variables

## 📚 API Integration

- RESTful API consumption
- Token-based authentication
- Error handling
- Loading states
- Data caching
- Real-time updates

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 📦 Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- Frontend Developer: [Your Name]
- UI/UX Designer: [Designer Name]
- Project Manager: [PM Name]

## 📞 Support

For support, email support@yourcompany.com or join our Slack channel.
