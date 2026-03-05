#!/bin/bash

echo "🚀 Insurance Broker Skill - Quick Publish Script"
echo "================================================"
echo ""

echo "Step 1: Login to npm"
npm login

if [ $? -ne 0 ]; then
  echo "❌ npm login failed. Please check your credentials."
  exit 1
fi

echo ""
echo "Step 2: Verify you're logged in"
npm whoami

echo ""
echo "Step 3: Build the package"
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please fix errors and try again."
  exit 1
fi

echo ""
echo "Step 4: Publish to npm (claiming the name!)"
npm publish

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully published!"
  echo ""
  echo "📦 Package: insurance-broker@0.1.0"
  echo "🔗 View at: https://www.npmjs.com/package/insurance-broker"
  echo ""
  echo "🎉 Congratulations! You've claimed the 'insurance-broker' name on npm!"
else
  echo ""
  echo "❌ Publish failed. Check the error above."
  exit 1
fi
