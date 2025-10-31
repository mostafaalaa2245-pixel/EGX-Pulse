#!/bin/bash

# 🚀 Egyptian Stock Exchange Tracker - Auto Start Script
# ═══════════════════════════════════════════════════════════

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║          📈 موقع البورصة المصرية - بدء التشغيل التلقائي    ║"
echo "║                  EGX Smart Tracker                           ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if dependencies are installed
echo -e "${BLUE}🔍 التحقق من الحزم المثبتة...${NC}"

if [ ! -d "/vercel/sandbox/server/node_modules" ]; then
    echo -e "${YELLOW}📦 تثبيت حزم الخادم...${NC}"
    cd /vercel/sandbox/server && npm install
fi

if [ ! -d "/vercel/sandbox/client/node_modules" ]; then
    echo -e "${YELLOW}📦 تثبيت حزم الواجهة...${NC}"
    cd /vercel/sandbox/client && npm install
fi

echo -e "${GREEN}✅ جميع الحزم مثبتة${NC}"
echo ""

# Start the server in background
echo -e "${BLUE}🚀 تشغيل الخادم...${NC}"
cd /vercel/sandbox/server
node server.js > /tmp/egx-server.log 2>&1 &
SERVER_PID=$!
echo -e "${GREEN}✅ الخادم يعمل على: http://localhost:4000 (PID: $SERVER_PID)${NC}"
echo ""

# Wait for server to start
sleep 2

# Start the client in background
echo -e "${BLUE}🚀 تشغيل الواجهة...${NC}"
cd /vercel/sandbox/client
npm run dev > /tmp/egx-client.log 2>&1 &
CLIENT_PID=$!
echo -e "${GREEN}✅ الواجهة تعمل على: http://localhost:5173 (PID: $CLIENT_PID)${NC}"
echo ""

# Wait for client to start
sleep 3

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                                                              ║"
echo "║                    ✅ الموقع جاهز الآن!                     ║"
echo "║                                                              ║"
echo "║              افتح المتصفح على الرابط التالي:               ║"
echo "║                                                              ║"
echo "║              🌐 http://localhost:5173                        ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}📝 ملاحظات:${NC}"
echo "   • الخادم PID: $SERVER_PID"
echo "   • الواجهة PID: $CLIENT_PID"
echo "   • لإيقاف الموقع: kill $SERVER_PID $CLIENT_PID"
echo "   • سجلات الخادم: /tmp/egx-server.log"
echo "   • سجلات الواجهة: /tmp/egx-client.log"
echo ""
echo -e "${GREEN}🎉 استمتع بتجربة التداول!${NC}"
echo ""

# Keep script running
wait
