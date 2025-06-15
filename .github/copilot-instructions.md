<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Weather App Development Instructions

This is a modern React weather application built with:

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Chart.js** with react-chartjs-2 for data visualization
- **Open-Meteo API** for weather data

## Key Design Principles

- **Mobile-first responsive design**
- **Glass morphism UI** with backdrop blur effects
- **Smooth animations** and transitions
- **Accessible color contrast** and interactive elements
- **Performance optimized** with proper React patterns

## Code Style Guidelines

- Use TypeScript interfaces for all data structures
- Implement proper error handling and loading states
- Use Tailwind utility classes for styling
- Create reusable components with clear props interfaces
- Follow React best practices with hooks
- Use proper semantic HTML elements

## API Integration

- The Open-Meteo API provides comprehensive weather data
- Implement proper error handling for network requests
- Use geolocation API with fallback to default location
- Cache weather data appropriately to avoid excessive requests

## Component Structure

- Keep components focused and single-responsibility
- Use proper TypeScript typing for all props
- Implement loading and error states for all async operations
- Use consistent naming conventions
- Create reusable utility functions for data formatting

## Performance Considerations

- Minimize re-renders with proper dependency arrays
- Use React.memo() for expensive components when needed
- Optimize chart rendering with appropriate options
- Implement proper cleanup for async operations
