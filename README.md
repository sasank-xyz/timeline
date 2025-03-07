# Historical Timeline Viewer

A beautiful, interactive timeline application built with React and TypeScript that allows users to explore historical events through the ages. The application features a sleek, modern interface with smooth animations and an intuitive user experience.

## Features

- **Year Selection**: Browse through years from 1800 to 2024 with an interactive vertical timeline
- **Event Timeline**: View historical events for any selected year in a beautiful alternating timeline layout
- **Real-time Data**: Fetches historical events from the API Ninjas Historical Events API
- **Smooth Animations**: Enjoy fluid transitions and hover effects throughout the interface
- **Responsive Design**: Works seamlessly across different screen sizes
- **Modern UI**: Clean, minimalist design with a dark theme and purple accents

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- An API key from API Ninjas

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/timeline.git
   cd timeline
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your API key:
   - Sign up for an account at [API Ninjas](https://api-ninjas.com/)
   - Once registered, get your API key from your account dashboard
   - Create a `.env` file in the root directory of the project
   - Add your API key to the `.env` file:
     ```
     VITE_API_NINJAS_KEY=your_api_key_here
     ```
   - Replace `your_api_key_here` with your actual API key from API Ninjas

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### API Key Security

⚠️ **Important**: 
- Never commit your `.env` file to version control
- Keep your API key private and secure
- The `.env` file is already included in `.gitignore` to prevent accidental commits

## Usage

1. **Years View**:
   - Scroll through the years (1800-2024)
   - Hover over years to see highlight effects
   - Click on any year to view its historical events

2. **Events View**:
   - View historical events in chronological order
   - Events alternate between left and right sides
   - Dates are formatted as "Month Day, Year"
   - Hover over event dots for highlight effects
   - Use the "Back to Years" button to return to year selection

## Technical Details

- Built with React 19 and TypeScript
- Uses Vite for fast development and building
- Implements CSS animations and transitions
- Fetches data from API Ninjas Historical Events API
- Uses environment variables for secure API key management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Historical event data provided by [API Ninjas](https://api-ninjas.com/)
- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
