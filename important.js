/*

One NodeJS project might contain multiple express apps, but this course (and most other
courses) will only have a single express app.

deployment
---------------
To handle deployment, we will use Heroku.

Pre-deployment checklist:
1 - Dynamic Port Binding - heroku tells us which port our app will use, so we need to make
    sure we listen on that right port.
    const PORT = process.env.PORT || 5000;

2 - Specify Node Environment - Tell Heroku exactly what version of Node to use
    add "engines" in package.json

3 - Specify Start Script - Instruct Heroku what command to run to start our server

4 - Create .gitignore file

Whenever heroku runs our app, it has the ability to inject ENV variables.
These variables are set in the underlying runtime That the Node is running on top of.
Essentially it is a way that Heroku passes some configurations to our app.

First-Type deployment:
1 - Create Heroku Account
2 - Commit project code to Git, because by default, Heroku uses Git based deployment
    workflow
3 - Install Heroku CLI and generate new Heroku project
    $heroku login
    $heroku create - creates new Heroku app:
      1st link is URL taht our app is deployed to
      2nd is the deployment target (git repo that we can push our code to)
      The instant we push our code to that repo, heroku will deploy our app.

4 - heroku buildpacks:set heroku/nodejs --app warm-hamlet-73221(ex app name)
    $git remote add heroku ...2nd link...
    $git push heroku master
    $git push (if we want to deploy to our own github repo too)

Google OAuth
---------------
** OAuth Flow diagram

We will be using a helper library called Passport.js, which is often used with Node applications
for authentication purposes.

** Oauth with Passport diagram

Passport weaknesses/weirdness:
1 - Passport does automate a lot of the stuff, ut it requires us to reach in several times in the
    process and make some steps work nicely. So it automates a vast majority of the OAuth flow,
    but not all of it. It makes understanding it a little tougher.
2 - Inherent confusion about how the library is structured.
    Basically, when installing passport, we are actually installing atleats 2 different libraries.

    passport - general helpers for handling authentication in Express apps
    passport strategy - helpers for authenticating with some specific method (email/password,
    Google, Facebook..)

$npm install --save passport passport-google-oauth20
oauth20 - it is encouraged to use either oauth1 or oauth20 (2.0 version because
you cannot put dots in npm package names).

const googleStrategy = require('passport-google-oauth20').Strategy; <- because it imports
several different properties, but we only need Strategy.

Before even using Google Strategy, we need to provide it with Client ID and Secret
For that, register new application in console.developers.google
enable Google+ API
Go to credentials and create OAuth client ID
Fill in the information (product name)
Select application type as Web Application
Authorized JS origins:
  http://localhost:5000
Authorized redirect URIs:
  http://localhost:5000/auth/google/callback*

Use client ID and Secret in the project :)

Client ID - public token, anyone else in the world can know its value. It's completely okay if
    we share taht token with the outside world. All it does is it identifies our
    application with Google Servers
Client Secret - should be secret :v If someone gets isby mistake or by purpose (hmm),
    he will have elevated privileges in our Google OAuth account, which is worst case
    scenario.

To protect keys, create directory config and keys.js file inside

When passing configuration object to new GoogleStrategy, callbackURL is going to be
the roite taht the user will be sent to after they grant permissions to our application.

passport.use(
  new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
  },
  // callback when Google sends user back to /auth/google/callback
  (accessToken, refreshToken, profile, done) => {
    // accessToken - the code from Google
    // refreshToken - undefined
    // profile - user profile information from Google

    // in this case we dont care about refreshToken. It is used to refresh the access
    // token because access token exipres after some time
  })
);

When user sends request to /auth/google, we usually would specify a callback function, but
now we handle it to passport to take care of it. The string 'google' that is passed
as argument is part of GoogleStrategy. Basically whenever someone wants to authenticate
with passport using that 'google' string, passport will automatically use
GoogleStrategy to authenticate him.
the scope specifies to Google servers what access about that user we want to get
from them. In this case we are asking only for profile and email, but we also have
the ability to ask for example for users contact list, read their emails or whatever :v.


MongoDB
---------------

Model class that is cming from Mongoose will be responsile for representing whole
collection in the database. It will have a lot of functions attached to it, and they
will allow us to create new records, get all records and many other operations for
that collection. Mongoose also has something called model instances.
odel instances are JS objects that represent a single record in the database collection.

Later on in the application we will get back to MongoDB with a lot more details.

*** create a database and connect to it
Windows - https://code.msdn.microsoft.com/Mongo-Database-setup-on-6963f46f

If deprecation warnings pop up during mongoose connection with mongo, feel free to
fix them or disregard them. They don't influence the application.


Schema is used to model data in the application. It will describe what every individual
record is going to look like.

For everything that is using Mongo model classes, we are not going to use require statements.
Sometimes when Mongoose is used inside of testing environments, model files will
be required in multiple files in the project. Mongoose will be very confused when that
happens, and it will think that we are trying to load multiple models called 'users'.

So that is why we are requiring it in different fashion inside of
services/passport.js file.

Passport gives us the callback function speifically to enable us to ex save that users info to a
database. We have to stell it when we are done with it so it can keep going with authentication flow.
That's what 'done' argument is for.

passport.serializeUser - function that takes in returned user model (after 'done' is called)
and it generates some piece of identifying information that we can associate with the user.

We are using mongo id instead of google id for the cookie because if we had mutiple
providers, it wouldn't make sense to use google ID

** serialize/deserialize diagram

serializeUser 'turns' a model into ID that gets sent in a cookie, and deserilizeUser
does the opposite thing.

** request -> cookie -> passport.. diagram

req.logout() - automatically attached by passport, kills the cookie





















*/
