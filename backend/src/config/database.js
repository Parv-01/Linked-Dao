const { DataSource } = require("typeorm");
const { UserProfile } = require("../models/profile.model");
const path = require('path');

const AppDataSource = new DataSource({
    type: "mysql",
    database: "linkOff",
    synchronize: true,
    logging: false,
    entities: [UserProfile],
    migrations: [],
    subscribers: [],
});

module.exports = {
    AppDataSource
};
