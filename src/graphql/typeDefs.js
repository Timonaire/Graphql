const {
    exec
} = require('child_process');
const axios = require('axios');
const fs = require('fs');

// Define the URL of the /latest-type-definitions endpoint in Service 2
const service2TypeDefs = 'https://github.com/Timonaire/MongodbService/blob/main/src/graphql/typeDefs.js';

// Function to fetch and save the latest type definitions
async function fetchAndSaveLatestTypeDefinitions() {
    try {
        // Fetch the latest type definitions from Service 2
        const response = await axios.get(service2TypeDefs
        );

        // Save the downloaded type definitions in Service 1
        const typeDefs = response.data;
        fs.writeFileSync('./latestTypeDefs.js', typeDefs, 'utf8');

        console.log('Latest type definitions saved successfully.');
    } catch (error) {
        console.error('Error fetching or saving latest type definitions:', error.message);
    }
}

// Deploy Service 1
function deployService1() {
    console.log('Deploying Service 1...');

    // Add deployment command

    exec('npm install', (error, stdout, stderr) => {
        if (error) {
            console.error(`Error during npm install: ${error.message}`);
            return;
        }

        console.log(`npm install stdout: ${stdout}`);
        console.error(`npm install stderr: ${stderr}`);

        // After successful installation, fetch and save the latest type definitions
        fetchAndSaveLatestTypeDefinitions();

        // Start service
        exec('npm start', (error, stdout, stderr) => {
            if (error) {
                console.error(`Error during npm start: ${error.message}`);
                return;
            }

            console.log(`npm start stdout: ${stdout}`);
            console.error(`npm start stderr: ${stderr}`);
            console.log('Service 1 deployment completed.');
        });
    });
}

// Call the deployment function
deployService1();
module.exports = {
    fetchAndSaveLatestTypeDefinitions,
    deployService1
}