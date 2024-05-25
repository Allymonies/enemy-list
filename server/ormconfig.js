module.exports = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "port": process.env.DB_PORT || 3306,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_NAME,
    "synchronize": true,
    "logging": true,
    "entities": [
      __dirname + "/entity/**/*.ts"
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
 }