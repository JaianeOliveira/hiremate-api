# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

# 1) só dependências
COPY package*.json ./
RUN npm ci --production=false

# 2) copia o schema pro prisma generate
COPY prisma ./prisma
RUN npx prisma generate

# 3) agora copia o resto do código e builda
COPY . .
RUN npm run build

# Stage 2: production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3333
CMD ["node", "dist/main"]
