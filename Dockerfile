FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
RUN npm ci --production=true

COPY --from=builder /app/dist ./dist

EXPOSE 3333

CMD ["sh", "-c", "\
  npx prisma migrate deploy && \
  node dist/main.js\
"]
