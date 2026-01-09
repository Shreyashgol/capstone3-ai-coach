#!/bin/bash

echo "🎨 Setting up Theme System..."
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the ai-coach-backend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Running database migration..."
npx prisma migrate dev --name add_theme_preference

echo ""
echo "✅ Theme system setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the backend: npm start"
echo "2. Start the frontend: cd ../ai-coach-frontend && npm run dev"
echo "3. Toggle the theme using the sun/moon icon in the header"
echo ""
echo "📚 See THEME_SYSTEM.md for full documentation"
