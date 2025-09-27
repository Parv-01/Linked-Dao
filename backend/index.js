require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { AppDataSource } = require('./src/config/database');
const profileRoutes = require('./src/routes/profile.route');
const jobPostingRoutes = require("./src/routes/job-posting.route");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/profiles', profileRoutes);
app.use('/job-postings', jobPostingRoutes);

async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Data Source initialized successfully. Tables synchronized.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log('Backend ready to manage Profiles and Jobs.');
        });
    } catch (error) {
        console.error("Error during Data Source initialization:", error);
        process.exit(1);
    }
}

startServer();
