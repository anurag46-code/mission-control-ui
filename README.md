# OpenClaw Mission Control UI

A stunning 3D visualization dashboard built with Next.js, Three.js, and React Three Fiber for monitoring agent fleets in real-time.

## Features

- 🎨 **Interactive 3D Scene** - Real-time agent avatars with smooth animations
- 🤖 **Agent Avatars** - Robot, drone, and hologram agent types with status indicators
- 📊 **Performance Monitoring** - Live FPS, CPU, memory, and network tracking
- ✨ **Particle Effects** - Dynamic particle system for immersive experience
- 🌌 **Cyberpunk Environment** - Starfield, floating data nodes, and ambient lighting
- 📱 **Mobile Responsive** - Optimized for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **3D Graphics**: Three.js + React Three Fiber
- **UI Components**: React + Tailwind CSS
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
mission-control-ui/
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── MissionScene.tsx     # Main 3D scene container
│   ├── AgentAvatar.tsx     # Interactive agent avatars
│   ├── Environment.tsx      # Starfield and ambient effects
│   ├── ParticleSystem.tsx   # Dynamic particle effects
│   ├── AgentPanel.tsx       # Agent fleet management panel
│   └── PerformanceMonitor.tsx # Real-time performance metrics
└── public/
    └── fonts/               # Custom fonts (Orbitron)
```

## Agent Types

- **🤖 Robot**: Box geometry with steady rotation
- **🚁 Drone**: Cylinder geometry with fast rotation
- **👻 Hologram**: Transparent octahedron with slow rotation

## Status Indicators

- **🟢 Online**: Green glow, active animations
- **🟡 Busy**: Yellow glow, faster animations
- **🔴 Offline**: Grayed out, no animations

## Performance Optimization

- **Dynamic Resolution**: Automatically adjusts based on device performance
- **Lazy Loading**: Components load only when needed
- **Efficient Rendering**: Uses Three.js instancing and buffer geometries
- **Memory Management**: Proper cleanup of Three.js objects

## Customization

### Adding New Agent Types

1. Update `AgentAvatar.tsx` with new geometry
2. Add configuration to `agentConfigs` object
3. Update the agent type in mock data

### Modifying Colors

Edit `tailwind.config.js` to customize the mission control color palette:

```javascript
colors: {
  mission: {
    primary: '#00D4FF',    // Main accent color
    secondary: '#FF6B6B',  // Warning/error color
    accent: '#4ECDC4',     // Secondary accent
    dark: '#1A1A2E',       // Dark background
    darker: '#0F0F1A',     // Darker background
  }
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Auto-deploys on push to main

### Build for Production

```bash
npm run build
npm start
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## License

MIT License - see LICENSE file for details.