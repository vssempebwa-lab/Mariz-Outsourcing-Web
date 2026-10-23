#!/bin/sh
set -eu

cd /opt/mariz-outsourcing-web

if [ ! -f .env ]; then
  echo "Missing /opt/mariz-outsourcing-web/.env" >&2
  exit 1
fi

docker compose up -d --build --remove-orphans

i=0
until docker exec mariz-outsourcing-web node -e "fetch('http://127.0.0.1:3000').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"; do
  i=$((i + 1))
  if [ "$i" -ge 30 ]; then
    echo "App did not become ready" >&2
    docker compose logs --tail 80 app >&2
    exit 1
  fi
  sleep 2
done

echo "mariz-outsourcing-web is responding"
