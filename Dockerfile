# PRODUCTION DOCKERFILE
# ---------------------
# This Dockerfile allows to build a Docker image of the NestJS application
# and based on a NodeJS 14 image. The multi-stage mechanism allows to build
# the application in a "builder" stage and then create a lightweight production
# image containing the required dependencies and the JS build files.
#
# Dockerfile best practices
# https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
# Dockerized NodeJS best practices
# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md
# https://www.bretfisher.com/node-docker-good-defaults/
# http://goldbergyoni.com/checklist-best-practice-of-node-js-in-production/

FROM node:24 AS builder

ENV NODE_ENV=build

# Update and install
RUN apt update && apt install -y jq

# App directory
WORKDIR /app

# App dependencies
COPY package*.json ./
RUN npm ci

# Generate metadata
RUN jq .version package.json -r > .package.version.txt
RUN jq .name package.json -r > .package.name.txt
RUN jq .description package.json -r > .package.description.txt

# Copy app source code
COPY . ./

RUN npm run build
RUN npm prune --omit=dev

# --- Release

FROM node:24-alpine

# env vars
ENV NODE_ENV=production

# Timezone
ENV TZ=America/Sao_Paulo

RUN apk add --no-cache tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# App directory
WORKDIR /app

# Copy from builder
COPY --from=builder /app/.package.*.txt /app/
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/newrelic.js /app/dist/
COPY --from=builder /app/node_modules /app/node_modules

# Ref: https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md#non-root-user
USER node

CMD PROJECT_VERSION=$(cat .package.version.txt) \
  PROJECT_NAME=$(cat .package.name.txt) \
  PROJECT_DESCRIPTION=$(cat .package.description.txt) \
  node dist/main
