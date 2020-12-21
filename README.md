[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# E-commerce Back End

# Description

A backend application to handle Node.js Restful CRUD API using Express and Sequelize to interact with MySQL database.

### Table of Contents

- [Installation](#installation)
- [Usage](#usage)

- [Questions](#questions)

## Installation

In order to utilize the tool, clone the repo and run npm install to download app dependencies. Create an .env file and populate the following
environment variables:<br>
DB_NAME='ecommerce_db'<br>
DB_USER='root' <br>
DB_PW='enter your personal mysql password'<br>
Run mysql -u root -p command followd by your password from the root of the project folder and create the database by running the source db/schema.sql; followed by the exit command.<br>
Run npm run seed in order to load bulk data into database and then node server.js will start the application.
Once successful, the console will log 'App listening on port' and CRUD operations can be performed through API client tools like Insomnia or Get requests through your web browser with the relevant URL address per route (e.g.:http://localhost:3001/api/products).

## Usage

Steps how to run and test the application are available in the following demo:<br>
![](assets/images/demo_e_commerce_api.gif)

## Questions

- Got questions? [email me](mailto:caspi.home@gmail.com)<br>
- [My GitHub profile](https://github.com/hcs847)
