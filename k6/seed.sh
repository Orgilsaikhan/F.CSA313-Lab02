#!/usr/bin/env bash
# seed.sh — k6 ачааллын тестэд зориулж өгөгдөл бэлтгэх
# Шаардлага: curl, jq
# Хэрэглээ: bash k6/seed.sh [BASE_URL]

set -euo pipefail
BASE="${1:-http://127.0.0.1:8000}"

echo "→ Tenant үүсгэж байна..."
TENANT=$(curl -sf "$BASE/v1/tenants" \
  -H 'Content-Type: application/json' \
  -d '{"name":"k6-load-test","slug":"k6-load-test"}')
TENANT_ID=$(echo "$TENANT" | jq -r '.id // .tenant_id // empty')
echo "  tenant: $TENANT_ID"

echo "→ Бот үүсгэж байна..."
BOT=$(curl -sf "$BASE/v1/chatbots" \
  -H 'Content-Type: application/json' \
  -d "{\"name\":\"k6-bot\",\"tenant_id\":\"$TENANT_ID\",\"type\":\"faq\"}")
BOT_ID=$(echo "$BOT" | jq -r '.id // .chatbot_id // empty')
echo "  bot: $BOT_ID"

echo "→ 5 FAQ бичлэг нэмж байна..."
for i in 1 2 3 4 5; do
  curl -sf "$BASE/v1/chatbots/$BOT_ID/faqs" \
    -H 'Content-Type: application/json' \
    -d "{\"question\":\"FAQ асуулт #$i\",\"answer\":\"FAQ хариулт #$i\"}" > /dev/null
  echo "  faq #$i"
done

echo ""
echo "Бэлтгэл дууслаа. Дараах тохиргоогоор k6 ажиллуулна уу:"
echo "  export BASE_URL=$BASE"
echo "  export BOT_ID=$BOT_ID"
echo "  export TOKEN=<your-jwt-token>"
echo "  k6 run -e VUS=30 -e DURATION=60s k6/api-load.js"
