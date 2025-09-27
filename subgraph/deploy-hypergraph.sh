#!/bin/bash

# Hypergraph Deployment Script for OnchainTrustNetwork

echo "🚀 Deploying OnchainTrustNetwork to Hypergraph Knowledge Graph"
echo "==============================================="

# Check if hypergraph CLI is installed
if ! command -v hg &> /dev/null; then
    echo "❌ Hypergraph CLI not found. Installing..."
    npm install -g hypergraph
fi

# Initialize hypergraph project if not already done
if [ ! -f "hg.config.json" ]; then
    echo "🔧 Initializing Hypergraph project..."
    npx hg init
fi

echo "📝 Current configuration:"
echo "  Network: celo-alfajores"
echo "  Contract: 0xabE83DaDFcaBA9137Ce8E75a294b9F946A073565"
echo "  Start Block: 5658157"
echo ""

# Build the subgraph
echo "🔨 Building subgraph..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check your schema and mappings."
    exit 1
fi

# Deploy to Hypergraph
echo "📡 Deploying to Hypergraph..."
echo "   This will create knowledge graph nodes for:"
echo "   - Users (with verification status)"
echo "   - Skills (with ratings)"
echo "   - Jobs (with sponsorships)"
echo "   - Trust relationships (ratings, sponsorships, hiring outcomes)"

# Start TypeSync for schema management
echo "🔧 Starting TypeSync for schema management..."
echo "   Access TypeSync at: http://localhost:3000"
echo "   Use TypeSync to:"
echo "   1. Design your knowledge graph schema visually"
echo "   2. Sync changes to schema.ts"
echo "   3. Publish schema to Hypergraph"

# Create a space for the knowledge graph
echo "📦 Creating Hypergraph space..."
echo "   Space ID: onchain-trust-network"
echo "   Description: OnchainTrustNetwork Knowledge Graph"

echo ""
echo "🎯 Next steps:"
echo "1. Run 'npx hg typesync --open' to manage your schema"
echo "2. Create a public space at https://thegraph.com/explorer"
echo "3. Deploy with 'npx hg deploy'"
echo "4. Query your knowledge graph via GraphQL"
echo ""
echo "📚 Useful commands:"
echo "  npx hg dev          - Start development server"
echo "  npx hg build        - Build the subgraph"
echo "  npx hg deploy       - Deploy to Hypergraph"
echo "  npx hg typesync     - Manage schema with TypeSync"
echo ""
echo "🔍 Test contract events with:"
echo "  node test-contract.js"