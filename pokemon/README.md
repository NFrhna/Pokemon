# 🎮 Pokémon Explorer

A modern, responsive web application built with React and Tailwind CSS that allows users to explore Pokémon using the public PokéAPI. Browse, search, and view detailed information about your favorite Pokémon!

## 🚀 Features

### Core Functionality
- **Browse Pokémon**: View a list of Pokémon with their images and names
- **Search Pokémon**: Real-time search functionality to find Pokémon by name
- **Load More**: Pagination system to load additional Pokémon (10 at a time)
- **Detailed View**: Click any Pokémon to see:
  - Official artwork image
  - Types (with color-coded badges)
  - Abilities
  - Base stats with visual progress bars

### UI/UX Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop screens
- **Clean Layout**: Modern card-based interface with proper spacing
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Custom Scrollbar**: Styled scrollbar for the Pokémon list
- **Visual Feedback**: Selected Pokémon highlighted with indigo border

## 📋 Requirements Met

✅ Retrieve Pokémon data from PokéAPI  
✅ Display at least 10 Pokémon (name and image)  
✅ Search Pokémon by name  
✅ Load more Pokémon to the list  
✅ Click Pokémon to see additional information (abilities, types, stats)  
✅ Clean and readable layout with Tailwind CSS  
✅ Responsive for mobile and desktop  

## 🛠️ Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **PokéAPI** - RESTful Pokémon API (https://pokeapi.co)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Steps to Run

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd pokemon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`
   - The app will automatically reload on code changes

### Build for Production
```bash
npm run build
```
The production-ready files will be in the `dist/` folder.

## 🎨 Design Decisions

### Component Architecture
- **Modular Components**: Separated into `PokemonCard`, `PokemonListItem`, and main `App` component for maintainability
- **Single File Structure**: Kept all components in one file for simplicity (can be split into separate files for larger projects)

### State Management
- **React Hooks**: Used `useState` for local state and `useEffect` for data fetching
- **No External Libraries**: Avoided Redux/Context API as the state is simple and localized

### API Integration
- **Parallel Fetching**: Used `Promise.all()` to fetch detailed Pokémon data in parallel for better performance
- **Pagination**: Implemented offset-based pagination (10 Pokémon per load)
- **Error Handling**: Added try-catch blocks and user-friendly error messages

### Styling Approach
- **Tailwind CSS**: Utility-first approach for rapid development
- **Responsive Grid**: Used Tailwind's responsive utilities (`lg:grid-cols-2`)
- **Type Colors**: Created a color mapping for all 18 Pokémon types
- **Custom Scrollbar**: Added custom styling for better aesthetics

### UX Improvements
- **Loading States**: Shows spinner while fetching data
- **Disabled Buttons**: Prevents multiple API calls during loading
- **Search on Enter**: Users can press Enter to search
- **Visual Stat Bars**: Progress bars for stats instead of just numbers
- **Image Optimization**: Used `object-contain` to prevent image distortion

## 📁 Project Structure

```
pokemon/
├── src/
│   ├── pokemon_card.jsx    # Main app component with all features
│   ├── main.jsx             # React entry point
│   ├── index.css            # Global styles with Tailwind directives
│   └── App.css              # Additional component styles
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── vite.config.js           # Vite configuration
```

## 🔧 Configuration Files

- **tailwind.config.js**: Configured to scan all JSX/TSX files
- **postcss.config.js**: Set up with @tailwindcss/postcss and autoprefixer
- **vite.config.js**: React plugin configuration

## 🐛 Known Limitations

- Search only works on loaded Pokémon (not global search across all 1000+ Pokémon)
- No caching mechanism (refetches data on page reload)

## 🚀 Future Enhancements

- Add Pokémon generation filters
- Implement global search across all Pokémon
- Add favorites/bookmarks feature
- Include Pokémon evolution chains
- Add dark mode toggle
- Implement infinite scroll instead of "Load More" button

## 📝 Notes

- The app uses official Pokémon artwork from PokéAPI's sprites
- All data is fetched from the free public PokéAPI (no authentication required)
- The app is client-side only (no backend required)

## 👨‍💻 Developer

Built as a technical assessment for demonstrating React and Tailwind CSS skills.

## 📄 License

This project is for educational/assessment purposes. Pokémon and Pokémon character names are trademarks of Nintendo.
