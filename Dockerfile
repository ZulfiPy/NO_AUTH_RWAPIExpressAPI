# Base image for dependencies
FROM node:20.9.0-alpine AS base

WORKDIR /app

COPY package*.json .

# Development stage
FROM base AS dev

RUN npm install

COPY . .

EXPOSE 3500

CMD ["npm", "run", "dev"]

# Build stage
FROM dev AS build
RUN npm run build

# Production stage
FROM node:20.9.0-alpine AS production

WORKDIR /app

ENV NODE_ENV production

COPY package*.json .

RUN --mount=type=cache,target=/app/.npm \
    npm set cache /app/.npm && \
    npm ci --only=production

# Copy the build output from the build stage
COPY --from=build /app/dist ./dist
COPY --from=dev /app/certs ./dist/certs

EXPOSE 3500

CMD ["node", "dist/index.js"]