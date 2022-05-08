Steps to run the project: 
- run npm install to make sure all neccessary depencedies are downloaded 
- create a -env file with a DATABASE_URL = "link" entry. The link can be retrived by running the command     heroku pg:credentials:url -a gym-recs
- make sure the .env file is being ignored 
- Run npm start to start the server up!