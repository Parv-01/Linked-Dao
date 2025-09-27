const { DataSource } = require("typeorm");
const path = require('path');

const AppDataSource = new DataSource({
    type: "mysql",

    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USER || "user",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "onchain_db",

    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
});

module.exports = {
    AppDataSource
};
