import busboy from 'connect-busboy';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import uintFormat from 'biguint-format';
import flakeId from 'flake-idgen';
import { createConnection } from "typeorm";
import { createProxyMiddleware } from 'http-proxy-middleware';

let app = express();
createConnection();

const port = process.env.PORT ? parseInt(process.env.PORT) : 4610;

const devReact = true;

var flakeIdGen = new flakeId({ datacenter: 0, worker: 0});

export function generateSnowflake() : string {
    return uintFormat(flakeIdGen.next(0, 'dec'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(busboy());
app.use(express.static('public', {extensions: ["html"]}));
if (!devReact) {
    app.use(express.static('../web/build', {extensions: ["html"]}));
}

if (devReact) {
    app.use('/', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true, ws: true }));
} else {
    app.use(function (req, res) {
        res.sendFile(path.join(__dirname, '../web/build/index.html'));
    });
}

console.log("Starting server");
const server = app.listen(port, '127.0.0.1', async function () {
    console.log("enemy list server started");
})