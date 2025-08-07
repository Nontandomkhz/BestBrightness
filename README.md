# AgriXchange Marketplace

**Connecting Farmers, Empowering Agriculture**

A modern digital marketplace built specifically for the agricultural sector, connecting farmers, buyers, and agricultural service providers across Africa. AgriXchange facilitates seamless buying and selling of crops, livestock, equipment, and agricultural services while promoting sustainable farming practices.

## Features

### Marketplace
- **Product Catalog**: Browse crops, livestock, equipment, and agricultural services
- **Advanced Search & Filtering**: Find products by category, location, price, and certifications
- **Real-time Inventory**: Live stock updates and availability tracking
- **Multi-vendor Support**: Connect with multiple sellers in one platform

### For Farmers & Sellers
- **Digital Storefront**: Create and manage your online agricultural store
- **Analytics Dashboard**: Track sales performance and market trends
- **Inventory Management**: Real-time stock control and automated alerts
- **Order Management**: Streamlined order processing and fulfillment

### For Buyers
- **Secure Transactions**: Multiple payment options including mobile money
- **Order Tracking**: Real-time updates on purchase and delivery status
- **Wishlist & Cart**: Save items and bulk purchasing capabilities
- **Review System**: Rate and review products and sellers

### Communication
- **Direct Messaging**: In-app communication between buyers and sellers
- **Negotiation Tools**: Price negotiation and bulk order discussions
- **Notifications**: Real-time updates on orders, messages, and market changes

### Security & Trust
- **Verified Profiles**: Authentication system for trusted transactions
- **Secure Payments**: Encrypted payment processing
- **Dispute Resolution**: Built-in system for handling transaction issues
- **Data Protection**: GDPR-compliant data handling

## Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, SCSS |
| **Backend** | Firebase (Firestore, Auth, Storage, Functions) |
| **Authentication** | Firebase Authentication |
| **Database** | Firestore NoSQL Database |
| **Storage** | Firebase Cloud Storage |
| **Hosting** | Firebase Hosting |
| **Styling** | SCSS with modular architecture |
| **Form Handling** | React Hook Form with Zod validation |
| **Routing** | React Router v6 |
| **Charts** | Chart.js for analytics |
| **Date Handling** | Day.js |

## Project Structure

```
agrixchange/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, logos, and static files
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Generic components (Button, Modal, etc.)
│   │   ├── forms/            # Form components
│   │   └── ui/               # Specific UI components
agrixchange/
├── public/                     # Static assets
├── src/
│   ├── assets/                # Images, logos, and static files
│   ├── components/            # Reusable UI components
│   │   ├── common/           # Generic components (Button, Modal, etc.)
│   │   ├── forms/            # Form components
│   │   └── ui/               # Specific UI components
│   ├── contexts/             # React Context providers
│   │   ├── AuthContext.tsx  # Authentication context
│   │   ├── CartContext.tsx  # Shopping cart context
│   │   └── ThemeContext.tsx # Theme management
│   ├── firebase/             # Firebase configuration and helpers
│   │   └── firebase.ts      # Firebase initialization
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useCart.ts       # Cart management hook
│   │   └── useLocalStorage.ts # Local storage hook
│   ├── layouts/              # Layout components
│   │   ├── MainLayout.tsx   # Main application layout
│   │   └── AuthLayout.tsx   # Authentication pages layout
│   ├── pages/                # Page components
│   │   ├── Home/            # Landing page
│   │   ├── Shop/            # Product catalog
│   │   ├── ProductDetail/   # Individual product page
│   │   ├── Cart/            # Shopping cart
│   │   ├── Checkout/        # Checkout process
│   │   ├── Profile/         # User profile
│   │   ├── Dashboard/       # Seller dashboard
│   │   ├── Auth/            # Authentication pages
│   │   └── Messages/        # Messaging system
│   ├── routes/              # Route configuration
│   │   ├── AppRoutes.tsx    # Main routing component
│   │   └── ProtectedRoute.tsx # Route guards
│   ├── services/            # API and business logic
│   │   ├── auth.ts          # Authentication services
│   │   ├── products.ts      # Product management
│   │   ├── orders.ts        # Order processing
│   │   └── messaging.ts     # Communication services
│   ├── styles/              # SCSS stylesheets
│   │   ├── base/            # Base styles and resets
│   │   ├── components/      # Component-specific styles
│   │   ├── layouts/         # Layout styles
│   │   ├── pages/           # Page-specific styles
│   │   ├── themes/          # Theme variables
│   │   └── main.scss        # Main SCSS entry point
│   ├── types/               # TypeScript type definitions
│   │   ├── auth.ts          # Authentication types
│   │   ├── product.ts       # Product types
│   │   └── order.ts         # Order types
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # Application constants
│   │   ├── helpers.ts       # Helper functions
│   │   └── validation.ts    # Validation schemas
│   ├── App.tsx              # Root component
│   └── main.tsx             # Application entry point
├── .env                     # Environment variables
├── .env.example            # Environment template
├── firebase.json           # Firebase configuration
├── .firebaserc            # Firebase project settings
├── package.json           # Dependencies and scripts
└── README.md              # Project documentation

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jabulani00/AfriXchange-Marketplace.git
   cd AfriXchange-Marketplace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase configuration in the `.env` file:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. **Initialize Firebase** (if not already done)
   ```bash
   firebase login
   firebase init
   ```
   Select: Firestore, Authentication, Hosting, Storage

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will open in your browser at `http://localhost:5173`.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run deploy` - Deploys to Firebase Hosting
- `npm run lint` - Runs ESLint for code quality
- `npm run format` - Formats code with Prettier

## Firebase Configuration

### Firestore Database Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products are readable by all, writable by owner
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.sellerId == request.auth.uid;
    }
    
    // Orders are accessible by buyer and seller
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        (resource.data.buyerId == request.auth.uid || 
         resource.data.sellerId == request.auth.uid);
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /user-avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow React functional components with hooks
- Use SCSS modules for component styling
- Implement proper error boundaries
- Write unit tests for utilities and services

### Folder Structure Rules
- Keep components small and focused
- Use barrel exports (index.ts files)
- Group related functionality together
- Separate concerns (UI, business logic, data)

### Git Workflow
1. Create feature branches from `main`
2. Use conventional commit messages
3. Create pull requests for code review
4. Ensure all tests pass before merging

## Deployment

### Production Build
```bash
npm run dev
```

### Deploy to Firebase Hosting
```bash
firebase deploy
```

### Environment-specific Deployments
```bash
# Deploy to staging
firebase use staging
firebase deploy

# Deploy to production
firebase use production
firebase deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup for Contributors
```bash
# Fork and clone your fork
git clone https://github.com/yourusername/AfriXchange-Marketplace.git
cd AfriXchange-Marketplace

# Add upstream remote
git remote add upstream https://github.com/Jabulani00/AfriXchange-Marketplace.git

# Install dependencies
npm install

# Create .env file with your Firebase config
cp .env.example .env
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Testing Strategy
- Unit tests for utilities and services
- Integration tests for complex workflows
- Component testing with React Testing Library
- E2E tests for critical user journeys

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get specific product
- `POST /api/products` - Create new product (sellers only)
- `PUT /api/products/:id` - Update product (owner only)
- `DELETE /api/products/:id` - Delete product (owner only)

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/:id` - Get specific order

## Performance Optimization

### Implemented Optimizations
- Code splitting with React.lazy
- Image lazy loading and optimization
- Firebase query optimization with proper indexing
- Component memoization for expensive renders
- Service worker for caching

### Monitoring
- Firebase Analytics for user behavior
- Firebase Performance for app performance
- Error tracking with Firebase Crashlytics

## Security Considerations

- Input validation on all forms
- Firestore security rules implementation
- Authentication state persistence
- Secure file upload handling
- XSS and CSRF protection

## Troubleshooting

### Common Issues

**Firebase Configuration Errors**
- Verify all environment variables are set correctly
- Check Firebase project settings
- Ensure Firebase services are enabled

**Build Failures**
- Clear node_modules and package-lock.json
- Run `npm install` again
- Check for TypeScript errors

**Deployment Issues**
- Verify Firebase CLI is logged in
- Check deployment targets are correct
- Review Firebase Hosting settings

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact & Support

- **Project Maintainer**: [Jabulani00](https://github.com/Jabulani00)
- **Repository**: [AfriXchange-Marketplace](https://github.com/Jabulani00/AfriXchange-Marketplace)
- **Issues**: Report bugs and request features through GitHub Issues

## Acknowledgments

- Firebase for backend infrastructure
- React community for excellent documentation
- Contributors and testers
- African agricultural community for inspiration

---

**Built with passion for African agriculture** 🌾
"# BestBrightness" 
"# BestBrightness" 
