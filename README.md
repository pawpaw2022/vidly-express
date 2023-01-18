# vidly-express

## Introduction 

Vidly-express is a project I built as I was learning nodejs and express framework. It is a movie rental backend that can store users, movies, movie genres, as well as issue digital auth token to authenticate/authorize users. 

## Technologies used (learned)

- Nodejs 
    - NPM modules system 
    - JavaScript Async Operations 
    - Refactoring Semantic Code 
- Express 
    - RESTful API   
    - HTTP requests 
    - Debug tools
- MongoDB 
    - Manupulate No-sql database 
    - CRUD 
    - Data Validation 
- Testing 
    - Unit test 
    - Integration test 
    - Test Driven Development (TDD)
    - Error handling using [Winston](https://www.npmjs.com/package/winston)

- Render 
    - Deploy app to the cloud 

## Deployment 

- <a href="https://render.com/" target="__blank">Render</a> for deploying express app (Can't afford Heroku :sob: )

<img src="/assets/api-test.png" alt="render">

- <a href="https://www.mongodb.com/atlas/database" target="__blank">MongoDB Atlas</a> for deploying mongodb to cloud 

<img src="/assets/mongo-atlas.png" alt="mongo-atlas">

## To play with Vidly

> Note: This might not be user-friendly as I haven't intergrated with a frontend yet. But hope it is coming soon... 

1. Download [POSTMAN](https://www.postman.com/)
2. Use different HTTP Request to interact with the database using the url: 

`https://vidly-express-render-1-0.onrender.com/api/<NAME>`


For example: 
GET https://vidly-express-render-1-0.onrender.com/api/genres to retrieve all genres 

![postman](/assets/postman)

