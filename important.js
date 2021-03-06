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

First-Time deployment:
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

When the project is deployed, we want to have a freash database taht is used for production app,
and a separate database that is used for development.

When we deploy our application to Heroku, there is an environment variable that is assigned by Heroku.
We are going to use that variable to determine if we are in development or production environment.

if(process.env.NODE_ENV === 'production') {
  // return prod set of keys
  module.exports = require('./prodkeys');
} else {
  // return dev set of keys
  module.exports = require('./devkeys');
}

prodkeys.js should be committed to Heroku
prodkeys.js file should look something like this:

module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.envGOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGO_URI,
  cookieKey: process.env.COOKIE_KEY
}

All these env variables should be set on Heroku (or whatever platform).

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

IN MORE DETAILS:

Middlewares are defined with app.use()
Middlewares are small pieces of code that modify the request in some way before they passport
it to route handlers. They are a great location to place some logic that is common for
many different route handlers.

If we don't want middleware to be applied for every single route handler, we can wire it up in such a way
that it preprocesses the request only for some route handlers.

** diagram express middleware

The cookie-session extracts the cookie data. It assigns the ID from a cookie to
req.session. When we then pass that request object to passport, passport takes taht id from
req.session and then passes it to deserializeUser...

Another way to manage cookies is to use other middleware called express-session.
express-session and cookie-session are different because cookie-session stores the
id in the cookie, and express-session stores the refference in the cookie.

** express-session diagram

So basically cookie-session stores all of the relevant data directly inside of the cookie,
while express-session stores all of the data in some like remote server-side data store, and
whenever the request comes in, it takes the relevant data from the request and pulls
the correcponding data from the data store on the server. Because data in the cookie is
just a reference to that other data. Thats fucking confusing but i think i got it.

So with express-session we can store a lot more data, and with cookie-session we cam
store only as much data s fits unside of the cookie (around 4kb). Since in this app all
we really care is the user ID, we use cookie-session.


CLIENT SIDE
---------------
add this part in client/package.json
"proxy": {
  "/auth/google": {
    "target": "http://localhost:5000"
  }
}

Now when we specify /auth/google path somewhere in react application, it doesn't go to
localhost:3000/auth/google (react), but localhost:5000 (express API endpoint).

For this redirect to work, we have to specify http://localhost:3000/auth/google/callback
as a valid redirect URI in our google developer console.

So this is working because:
** dev mode diagram

Inside of the browser, whenever we go to localhost:3000, we will see our react application, because the
application server that comes with create-react-app bootstrapped applications is going
to return to the user a bundle.js file that is going to contain all of the development assets.
(Like react library, redux and shit from client/package.json). So, when user tries
to sign in with google by navigating to /auth/google, that request will go through proxy
(which is part of create-react-app server), that proxy will forward the request to localhost:5000
(express API server), and thats what we specified in client/package.json. So for every different API route
taht our React app has to access, just register it inside of client/package.json.
All of this is just for development mode.

In production mode, this automacically works! In production, the create-react-app server
does not even exist. In production, before we even deploy our project, we are going to build
our react project.

** Prod mode diagram
create-react-app is going to take all of the frontend files, run babel and webpack,
and save final build of our application into client/build folder. Then, when user
comes to deployed application, we will just send them the HTML file and the newly built JS file
That was just placed into that build folder.

&npm run build (inside of client) - creates optimized production build and saves to build folder

Browser will automatically prepend the domain name in production, and that is the adventage
of using relative links.

So create-react-app is amazing for us to use while we are developing our application, but also
useful when we are deploying the production ready application. All of this can absolutely be accomplished
with Webpack build process, this is just another way.

whyy THE FUCK this architecture???
----------------------------------

Application copuld be made from 2 separate servers, one for API and one for React Client
We didn't take that aproach because we are using cookies as authentication method in the app.
That is the issue number one. If 2 servers were separate, browser would not be allowed to
send same cookies to a server and a client domain. This is purely to prevent a security issue,
and is a built in behavior in the browser.

This way by using proxy (in dev mode), browser never even communicates with localhost:5000,
Our React application is the one who does. Browser doesn't even know that the proxy exists.

Browser actually has the ability to send cross domain requests that contain same cooke, but
this way our life is easier because we don't have to worry about that xD

** dev setup crazy diagram (Fuck U Stephen xD)
** prod setup diagram

FETCH
----------

finction getData() {
  fetch('https://someurl.com')
    .then(res => res.json())
    .then(jsondata => console.log(jsondata));
}

Whenever we make a request with fetch, it is going to return a Promise. Tht promise is
resolved with an object that represents the underlying request. When the promise is resolved, the
.then() callback is executed.

res.json() returns the promise of its own, which is resolved after the JSON in the request
is ready for us to work with.

This snippet of code is going to work only if user has modern browser.

** fetch diagram?

The sole purpose with this new ES6 syntax is to make working with promises easier.
Under the hood everything is happenning exactly the same, but the syntax is prettier.
The new syntax is called async await.
First we define a function in code that contains some async code.
1 - put async keyword in front of that function declaration.
2 - put await keywords before promise
3 - assign to some variables

async function getData() {
  const res = await fetch('.....');
  const json = await res.json();
  console.log(json);
}

async keyword can also be used with arrow functions.

const getData = async () => {
  const res = await fetch('.....');
  const json = await res.json();
  console.log(json);
}

Frontend + Backend
----------------------

**Application Bootup process
* Will use Redux Thunk

** authReducer diagram?

Logout can be implemented in 2 ways. 1st is traditional a tag that leads to /api/logout,
and the other way is to send ajax request to /api/logout endpoint, do all the fancy stuff
with redux and actions... This second aproach is faster and provides betterUX, but in this case
lets use the tarditional, simpler method.

Billing
------------
- never accept raw creadit card numbers
- never store credit card numbers
- always use an outside payment processor

- avoid monthly payments and multiple plans
- fraud and chargebacks are a pain

** payment process form
  stripe will handle credit card && video explanation (089)

When we make use of stripe, we traditionally install a plugin authored by Stripe into our ReactJS
application. Anytime we want to accept a creadit card number, we tell that plugin to generate
and show a credit card form to the user. So the form is generated by stripe themselves, not us.
Details will be sent directly to stripe API.

When you first register a stripe account, it will set up a test account for the purpose
of testing fake credit card numbers. We get a set number of preset credit card numbers
that stripe will accept and assume they are real.

Go to API and find public (publishable) key and secret key
On teh front-end we only need the publishable key.

Stripe checkot plugin:
https://stripe.com/checkout

Billing with React appliction is slightly different than billing with any other type of
frontend application. When we make use of checkout JS, we will use react-stripe-checkout
library.  We will use a component from there rather than base JS stuff.

$npm install --save react-stripe-checkout

create-react-app has a special way of handling API keys.
documentation can be found by searching create-react-app environment variablees.
The stripe key will be defined as a environment variable. Any custom variables will
have to start with 'REACT_APP'. All of the env variables shouyld be defined on process.ENV,
just like on the backend.

To define permanent env variable, define .env file in the root of the project.
We can create ultiple .env files, for example .env.development, .env.production..

console.log('test:');
console.log('STRIPE:' + process.env.REACT_APP_STRIPE_KEY);
console.log(process.env.NODE_ENV);    ...to test out

Amount inside <StripeCheckout /> component is in cents.
Token - expects to recieve callback function that is going to be executed after we ahve
successfuly retreived authorization token from stripe API. After user enters credit card details,
those details are sent directly to Stripe by the form, and then the Stripe sends back a token
representing a charge. 'onToken' would be much better name though but oh well..

The special test credit card number that has to be used during testing phase is
4242 4242 4242 4242
expiration(ex): 10/20 (sometimes in the future)
CVC(ex): 736 (any 3 digits)

The 'Token' tat is sent to Stripe after form submit is actually an object which
represents the charge. It can be seen in the console, The closest think to a token inside it
is an id property. With this id property, we can make a follow up request to Stripe from
our backend to actually bill the person.

At application bootup time, we will retreive the information about the user.
Whenever user pays some money, and we take that token and send it to our backend API, the API
will do the follow up request with Stripe and after the user has been successfully charged,
The server will update the number of credits that the user has, and it will send back
the current user model, with new value of credits taht user has. This way we will always have the
credits information available in authReducer.js. Another way to do this would be to create
new credits reducer or something, but why bother when the information is already available
inside of the authReducer.

On the backend we are going to use another Stripe library that will exchange the token from
the front-end and exchange it for the actual charge from users credit card.

$npm install --save stripe    *also read the docs, specifically charges section

Basically we have to create the charge object that contains the configuration that
describes what do we want to charge the user for.
When creating the charge object, we have to specify the callback that is going to be
executed when everything is complete. The npm stripe module that we installed instead
of using the official stripe API also allows us to use a Promise instead of a regular callback.

When the payment is complete, we increase the credits on the user object that comes in
with every request(assigned by passport). However, we also have to handle the case if someone makes
a request to this endpoint, but is not logged in. To do this, we can create a middleware
that will be applied only to certain routes.
* express route can accept more than one middleware


*/
