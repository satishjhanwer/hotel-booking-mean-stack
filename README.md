# Hotel Booking Mean Stack

========================

Using MEAN stack to implement a simple hotel booking application where user can search hotels in database and book them.

## MEAN Stack

1. MongoDB: use MongoDB to store data

2. Express.js: use Express Server to handle all the back-end business logic

3. Angular 20: use Angular 20 to build the front-end

4. Node JS 22: use Node JS 22 to run the server

## Instructions

1. Clone the repo: `git clone https://github.com/satishjhanwer/hotel-booking-mean-stack.git`
2. Install packages: `yarn install`
3. Change the database configuration in `packages/backend/.env`
4. At the root of the repo run this command: `yarn start` (This will spinoff both frontend and backend at respective
   ports)

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
