import busboy from 'connect-busboy';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';
import uintFormat from 'biguint-format';
import flakeId from 'flake-idgen';
import { createConnection } from "typeorm";
import { createProxyMiddleware } from 'http-proxy-middleware';
import authUser from './authUser';
import { Enemy } from './entity/Enemy';

let app = express();
createConnection({
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "synchronize": true,
    "logging": false,
    "entities": [
      Enemy
    ],
    "migrations": [
       "migration/**/*.ts"
    ],
    "subscribers": [
       "subscriber/**/*.ts"
    ],
    "cli": {
       "entitiesDir": "entity",
       "migrationsDir": "migration",
       "subscribersDir": "subscriber"
    }
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 4610;

const devReact = false;

var flakeIdGen = new flakeId({ datacenter: 0, worker: 0});

export function generateSnowflake() : string {
    return uintFormat(flakeIdGen.next(0, 'dec'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(busboy());
app.use('/edit', (req, res, next) => {
    if (!authUser(req)) {
        res.redirect('/');
        return;
    } else {
        next();
    }
});
app.use(express.static('public', {extensions: ["html"]}));
if (!devReact) {
    app.use(express.static('../web/build', {extensions: ["html"]}));
}

// Get enemies
app.get('/api/enemies', async (req, res) => {
    let enemyEntities = await Enemy.find({ order: { order: "ASC" } });
    let enemies = enemyEntities.map(enemy => {
        return {
            name: enemy.name,
            description: enemy.description
        }
    });

    return res.status(200).json({"enemies": enemies});
})

// Set enemies
app.post('/api/enemies', async (req, res) => {
    if (!authUser(req)) {
        return res.status(401).send("Unauthorized");
    }
    if (!req.body.enemies) {
        res.status(400).json({error: "No enemies provided"});
        return;
    }
    let enemies = req.body.enemies;
    Enemy.clear();
    for (let i = 0; i < enemies.length; i++) {
        let enemy = new Enemy();
        enemy.id = generateSnowflake();
        enemy.order = i;
        enemy.name = enemies[i].name;
        enemy.description = enemies[i].description;
        await enemy.save();
    }
    return res.status(200).json({success: true});
})

if (devReact) {
    app.use('/', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true, ws: true }));
} else {
    app.use(function (req, res) {
        res.sendFile(path.join(__dirname, '../web/build/index.html'));
    });
}

console.log("Starting server");
const server = app.listen(port, '0.0.0.0', async function () {
    console.log("enemy list server started");
})