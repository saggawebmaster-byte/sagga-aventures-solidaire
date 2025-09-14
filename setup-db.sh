#!/bin/bash

# Script pour basculer entre SQLite (dev) et PostgreSQL (prod)

echo "🔄 Configuration de l'environnement de base de données..."

if [ "$1" = "dev" ]; then
    echo "📦 Configuration pour le développement (SQLite)..."
    
    # Backup current schema
    cp prisma/schema.prisma prisma/schema.prisma.backup 2>/dev/null || true
    
    # Copy dev schema
    cp prisma/schema.dev.prisma prisma/schema.prisma
    
    echo "✅ Configuration SQLite activée"
    echo "🔧 Variables d'environnement suggérées pour .env.local:"
    echo "DATABASE_URL=\"file:./dev.db\""
    echo "NODE_ENV=\"development\""
    echo ""
    echo "🔧 Lancez 'npm run db:dev' pour synchroniser"
    
elif [ "$1" = "prod" ]; then
    echo "🚀 Configuration pour la production (PostgreSQL)..."
    
    # Backup current schema
    cp prisma/schema.prisma prisma/schema.prisma.backup 2>/dev/null || true
    
    # Restore original PostgreSQL schema
    if [ -f "prisma/schema.prisma.backup" ]; then
        cp prisma/schema.prisma.backup prisma/schema.prisma
    fi
    
    echo "✅ Configuration PostgreSQL activée"
    echo "🔧 Variables d'environnement requises:"
    echo "DATABASE_URL=\"postgresql://...\""
    echo "NODE_ENV=\"production\""
    echo ""
    echo "🔧 Configurez DATABASE_URL et lancez 'npm run db:push'"
    
else
    echo "Usage: ./setup-db.sh [dev|prod]"
    echo "  dev  - Configure pour SQLite (développement)"
    echo "  prod - Configure pour PostgreSQL (production)"
    echo ""
    echo "Scripts npm disponibles:"
    echo "  npm run db:dev    - Synchronise SQLite en développement"
    echo "  npm run db:push   - Pousse le schéma vers PostgreSQL"
    echo "  npm run db:studio - Ouvre Prisma Studio"
fi
