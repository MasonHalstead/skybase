# SKYDAX API

## Starting DEV API

npm run start:dev - Nodemon will watch for file changes and automatically rebuild on save. 

## HEROKU Login

heroku version : Checks the version
heroku login : opens browser login

## ADDED HEROKU Git
heroku git:remote -a skydax-api -r skydax-api
Pushing the local project to Heroku will build and serve the API

## HEROKU POSTGRESQL LOGIN
heroku pg:psql postgresql-horizontal-72522 --app skydax-api
Connects to Heroku PostgresQL

## HEROKU POSTGRESQL ADDON
heroku addons:add heroku-postgresql
Added a database url variable to project 

## HEROKU DEPLOY
git push skydax-eu master
git push skydax-test master

## HEROKU LOGS 
heroku logs --tail -a skybase-api