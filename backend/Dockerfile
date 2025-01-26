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

# Expose port 3001
EXPOSE 3001

# Run dev server
CMD npm run start
