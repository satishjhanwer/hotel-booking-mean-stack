# hotel-booking-mean-stack

========================

Using MEAN stack to implement a simple hotel booking application where user can search hotels in database and book them.

## MEAN Stack

1. MongoDB: use mongo as the persistent data store

2. Express.js: use express as the web server to handle routing the calls

3. Angular.js: use angular framework as the front-end template engine

4. Node.js: use node to handle all the back-end business logic and database access

## Instructions

1. Clone the repo: `git clone https://github.com/satishjhanwer/hotel-booking-mean-stack.git`
2. Install yarn and bower `npm i -g yarn bower`
3. Install packages: `yarn install`
4. Change the database configuration in `config/database.js`
5. Launch: `npm run dev`
6. Visit in your browser at: `http://localhost:3000`

## Database

Once project is up and running, create a user. Go back to your database and update the user collection, set isAdmin to
true for the user you have created just now. This to make sure we have one admin user which can add hotels into the
hotels collection.

```javascript
{
	"isAdmin": true, // Set this to true to make the user admin
	"email": "someuser@someportal.com",
	"firstName": "FirstName",
	"lastName": "LastName",
	"password": "passwordInHashedForm"
}
```

After the above step, try to login with Admin user, there you will find screen where you can add hotels data into db.
From admin screen you can manage all the registered users as well.
