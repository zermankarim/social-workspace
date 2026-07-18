FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Prisma Client must be generated before Nest/TypeScript compile.
# Dummy URL is enough for `prisma generate` (no DB connection).
ENV DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"

# ---------------- DEV ----------------
FROM base AS dev
EXPOSE 8000
CMD ["npm", "run", "start:dev"]

# ---------------- BUILD ----------------
FROM base AS build
RUN npm run build

# ---------------- PROD ----------------
FROM node:24-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production
# Overridden at runtime by Railway/hosting; placeholder for generate during image build.
ENV DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/postgres"

COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm install --omit=dev && npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/src/main.js"]
