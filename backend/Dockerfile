FROM node:23-alpine AS base

FROM base AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm ci


FROM base AS runner
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate

# Expose port 3001
EXPOSE 3001

# Run dev server
CMD npm run prisma:migrate:reset:force && npm run ingress && npm run dev