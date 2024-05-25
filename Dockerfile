FROM node:18-alpine as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base as install
RUN mkdir -p /temp/web/dev
COPY web/package.json web/bun.lockb /temp/web/dev/
RUN cd /temp/web/dev && npm install


# install dependencies into temp directory
# this will cache them and speed up future builds
RUN mkdir -p /temp/server/dev
COPY web/package.json web/bun.lockb /temp/server/dev/
RUN cd /temp/server/dev && npm install

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
RUN mkdir -p /usr/src/app/web
COPY --from=install /temp/web/dev/node_modules web/node_modules
RUN mkdir -p /usr/src/app/server
COPY --from=install /temp/server/dev/node_modules server/node_modules
COPY . .

ENV NODE_ENV=production
WORKDIR /usr/src/app/web
RUN npm run build

FROM base AS release
COPY --from=prerelease /usr/src/app/server/ server/
COPY --from=prerelease /usr/src/app/web/build web/build

# run the app
ARG PORT=4610
EXPOSE $PORT/tcp
WORKDIR /usr/src/app/server
ENTRYPOINT ["npm", "run", "start"]