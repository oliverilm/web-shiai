# Batteries included fullstack boilerplate

This is a boilerplate for your next big SaaS application. Just plug and play

## Backend

The backend utilizes the django ninja framework, to get the power of django ORM and admin panel, with the speed and simplicity of ninja

This basic boilerplate has build it: 
* 📧  Regular authentication & registration
* 🚀  Google authentication & registration
* 🔗  Google account linking and unlinking
* 🔨  Starter for your custom business logic

The whole authentication is built with JWT tokens

### Setup


The application is dockerized and requires minimal setup steps to get you going. You still have to populate some env fields manually

1. populate the env file in backend and frontend

```sh
cat ./backend/.env-example > ./backend/.env
cat ./frontend/.env-example > ./frontend/.env
```
### Routes

The boilerplate version of this code is divided into 3 routes

* auth
    * this handles all of the user related stuff
* token
    * token verification & retrieval
* api
    * custom business logic for your application

routing will take place within the ninja api and gets implemented inside `api/urls.py` file

Generated swagger can be found on `http://localhost:8000/docs`

## Frontend
todo

## Infrastructure
todo

## Deployment
todo# web-shiai
# web-shiai
