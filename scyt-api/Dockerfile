# syntax=docker/dockerfile:1

FROM node:20-bullseye-slim AS base
WORKDIR /app

RUN apt-get update -y \
	&& apt-get install -y --no-install-recommends libssl1.1 openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

ENV PORT=8000
EXPOSE 8000

CMD ["npm", "start"]
