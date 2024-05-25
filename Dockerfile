FROM node:18-alpine as base
FROM oven/bun:1 as bun
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base as install
RUN mkdir -p /temp/web/dev
COPY web/package.json web/bun.lockb /temp/web/dev/
RUN cd /temp/web/dev && npm install

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM bun as install_bun
RUN mkdir -p /temp/server/dev
COPY server/package.json server/bun.lockb /temp/server/dev/
RUN cd /temp/server/dev && bun install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
WORKDIR /usr/src/app
RUN mkdir -p /usr/src/app/web
COPY --from=install /temp/web/dev/node_modules web/node_modules
COPY . .
ENV NODE_ENV=production
WORKDIR /usr/src/app/web
RUN npm run build

FROM bun as prerelease_bun
RUN mkdir -p /usr/src/app/server
COPY --from=install_bun /temp/server/dev/node_modules server/node_modules
COPY . .

FROM bun AS release
COPY --from=prerelease_bun /usr/src/app/server/ server/
COPY --from=prerelease /usr/src/app/web/build web/build

# run the app
ARG PORT=4610
EXPOSE $PORT/tcp
WORKDIR /usr/src/app/server
ENTRYPOINT ["bun", "run", "index.ts"]