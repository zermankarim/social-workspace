FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

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

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 8000

CMD ["node", "dist/main.js"]