# Smart Learner India - Deployment Guide

## Render Deployment Settings

### Option 1: Using render.yaml (Recommended)
The project includes a `render.yaml` file that automatically configures everything. Just connect your GitHub repo to Render and it will use these settings.

### Option 2: Manual Configuration
If you prefer to configure manually in the Render dashboard:

**Service Type:** Static Site

**Build Settings:**
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

**Important Notes:**
- The build command must include `npm install` to ensure all dependencies are installed
- The publish directory is `dist` (created by Vite during build)
- Render will automatically detect this as a Node.js project

### Troubleshooting
If you see "Publish directory dist does not exist":
1. Make sure the Build Command is: `npm install && npm run build`
2. Verify the Publish Directory is set to: `dist`
3. Check that the build completes successfully before deployment

The `render.yaml` file handles all of this automatically, including:
- Proper caching headers for assets
- SPA routing (all routes redirect to index.html)
- Optimized cache settings
