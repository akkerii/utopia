# Utopia AI Frontend

A modern React/Next.js frontend for the Utopia AI business advisory platform. This application provides a polished interface for AI-powered business consulting through natural conversations.

## Features

### 🎯 **Dual Mode Operation**

- **Entrepreneur Mode**: Guided business planning from idea to launch
- **Consultant Mode**: Strategic problem-solving for existing businesses

### 🤖 **AI Agent Integration**

- **Idea Agent**: Creative brainstorming and concept refinement
- **Strategy Agent**: Business strategy and planning
- **Finance Agent**: Financial modeling and projections
- **Operations Agent**: Operational planning and execution

### 📊 **Interactive Dashboard**

- Real-time business plan visualization
- Module-based progress tracking
- Dynamic context updating
- Visual progress indicators

### 💬 **Smart Chat Interface**

- Context-aware conversations
- Agent switching indicators
- Message history with timestamps
- Loading states and animations

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend server running on port 3000

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env.local` file:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3001](http://localhost:3001)

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and animations
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ChatInterface.tsx # Chat messaging interface
│   ├── Dashboard.tsx     # Business modules sidebar
│   ├── Header.tsx        # Navigation header
│   └── ModeSelector.tsx  # Initial mode selection
├── lib/                  # Utilities and configuration
│   ├── api.ts           # Backend API integration
│   ├── modules.ts       # Business module configuration
│   └── utils.ts         # Utility functions
└── types/               # TypeScript type definitions
    └── index.ts         # Shared interfaces and enums
```

## Key Components

### ModeSelector

Initial landing page allowing users to choose between Entrepreneur and Consultant modes with detailed descriptions and benefits.

### Dashboard

Sidebar component displaying:

- Business plan modules with completion status
- Progress tracking and summaries
- Interactive module navigation
- Visual progress indicators

### ChatInterface

Main conversation interface featuring:

- Message history with agent indicators
- Real-time typing indicators
- Responsive input handling
- Automatic scrolling

### Header

Navigation component with:

- Session information
- Agent status display
- Reset and home functionality
- Breadcrumb navigation

## API Integration

The frontend connects to the backend through:

- **POST** `/api/chat` - Send messages and receive AI responses
- **GET** `/api/session/:id` - Retrieve session data and history
- **POST** `/api/session/:id/clear` - Reset session state
- **GET** `/api/health` - Backend health check

## Business Modules

The application tracks progress across seven core business modules:

1. **Idea Concept** - Business idea development
2. **Target Market** - Customer identification
3. **Value Proposition** - Unique value definition
4. **Business Model** - Revenue and cost structure
5. **Marketing Strategy** - Customer acquisition
6. **Operations Plan** - Execution planning
7. **Financial Plan** - Financial projections

## Features Highlights

### Responsive Design

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions

### User Experience

- Smooth animations and transitions
- Intuitive navigation
- Clear visual feedback
- Loading states and error handling

### Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint checks

### Code Style

The project uses:

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (configured in Next.js)

### Component Design

Components follow these principles:

- Single responsibility
- Props-based configuration
- TypeScript interfaces
- Tailwind CSS styling

## Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables

For production deployment, configure:

- `NEXT_PUBLIC_API_URL` - Backend API endpoint

### Hosting Recommendations

- **Vercel** - Optimal for Next.js applications
- **Netlify** - Great alternative with easy setup
- **AWS Amplify** - Enterprise-grade hosting

## Integration with Backend

Ensure the backend server is running with:

- OpenAI API key configured
- CORS enabled for frontend domain
- All required endpoints available

## Contributing

1. Follow TypeScript best practices
2. Maintain component modularity
3. Use meaningful commit messages
4. Test UI interactions thoroughly
5. Ensure responsive design compatibility

## Performance Considerations

- Components use React.memo where appropriate
- API calls are optimized with proper loading states
- Images and assets are optimized
- Bundle size is monitored

## Future Enhancements

Potential improvements for subsequent phases:

- Dark mode support
- Multi-language support
- Advanced data visualization
- Real-time collaboration features
- Enhanced mobile experience
- Progressive Web App capabilities

---

This frontend implementation provides a solid foundation for the Utopia AI MVP while maintaining extensibility for future feature additions and improvements.
