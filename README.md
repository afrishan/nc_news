# NC News API

This repository contains the code for NC News, a project created as part of the Software Development Javascript Bootcamp by Northcoders.

For a list of available endpoints and request formats, refer to the `endpoints.json` file in the repository or the hosted version of the NC News api endpoints found here: https://nc-news-lkc8.onrender.com/api

## Project Summary

NC News API is a RESTful web service that provides access to news articles, user comments, and topics. It serves as the backend for a news aggregation application, allowing users to retrieve, post, and interact with articles and comments.

## Installation and Setup

### 1. Clone the Repository

`git clone <repository_url>`

`cd nc_news-main`

### 2. Install Dependencies

To install the dependancies used inn this repo, input the following command.

`npm install`

### 3. Create Environment Files

This project requires two .env files to configure the PostgreSQL database:

- .env.development (for development environment)

- .env.test (for testing environment)

Create these files in the root directory, msking sure they have been added to .gitignore file, and add the following variables:

.env.development:

`PGDATABASE=<development_database_name>`

.env.test:

`PGDATABASE=<test_database_name>`


## Setup Local Database

Ensure you have PostgreSQL installed. Then, run the following commands to create and seed the database:

`npm run setup-dbs  // Creates the databases`

`npm run seed-dev       // Seeds the development database`

## Run the Application

`npm start`

This will start the server on the specified port (default: 3000).

## Run Tests

To run the entire test suite, use:
`npm t`

or to run a particular test suite, use:
`npm t <test-suite-name>`

## Minimum Requirements

Node.js: v23.4.0

PostgreSQL: 14.15 (Homebrew)

