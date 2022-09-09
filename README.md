
# Simple backend blog app

## What

Test task for **s4p**

## Requirements

- Should support login using some form of authentication 
- Should have at least a couple of routes
- Should have a couple of tests
- Should be able to list blog entries
- Should be able to create new ones

## Endpoints

`GET /user` Get current user profile
`PUT /user` Update current user profile
`GET /user/:id` Get user profile by his id
`POST /user/signup` User registration endpoint
`POST /user/login` User log in endpoint

`GET /content/:id` Get article by its id
`PUT /content/:id` Update article by id
`DELETE /content/:id` Delete article by id
`GET /content` Get all public articles
`POST /content` Post new article

## Expected input format

**`POST /user/signup`**
```
{
name*: string,
username*: string,
password*: string,
email*: string
}
```

**`POST /user/login`**
```
{
username*: string,
password*: string
}
```

**`PUT /user`**
```
{
name: string,
username: string,
password: string,
email: string
}
```

**`POST /content`**
```
{
name*: string,
data*: string,
isPublic: string
}
```

**`PUT /content`**
```
{
name: string,
data: string,
isPublic: string
}
```
\* - required

## Expected ENV params

`JWT_SECRET: string` 
`SALT: string`
`LOGGING_LEVEL: [emerg, alert, crit, error, warning, notice, info, debug]`

## Stack

- Node.js
- Express
- Sequelize
- SQLite
- Winston
- Mocha
- Supertest

## TODOs

- Improve test coverage
- More input sanitizing
- More granularity

## Notes
- Sequelize CLI for SQLite supports neither drop, nor create, so test DB has to be deleted manually
- Sequelize in general supports singular naming for tables but its CLI doesn't. Had to switch to plural to avoid conflicts
- Filtering out incorrect inputs was omitted to save some development time