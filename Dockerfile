# Stage 1: builder
FROM node:22-alpine AS builder
WORKDIR /app

# Instala dependências de build
COPY package*.json ./
RUN npm ci --production=false

# gera o Prisma Client
RUN npx prisma generate

# Compila a aplicação NestJS para JavaScript
COPY . .
RUN npm run build

# Stage 2: production
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia artefatos necessários
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Ignora arquivos inúteis em build
COPY .dockerignore .dockerignore

# Expõe a porta 
EXPOSE 3333

# Executa o bundle compilado
CMD ["node", "dist/main"]
