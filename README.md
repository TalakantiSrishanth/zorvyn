# FinTrack Backend

Hey! This is the backend for the FinTrack dashboard. I built it using Node.js and Express. 

The main focus here was getting the core business logic, role-based access control (RBAC), and data aggregations working cleanly without over-engineering the architecture.

## Tech Stack
Just the basics:
* Node.js
* Express.js
* MongoDB (via Mongoose)

## How to run it
1. Make sure you have MongoDB running locally. (If you prefer cloud, just swap out the `MONGO_URI` in `server.js` with your Atlas connection string).
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Spin up the server:
   ```bash
   node server.js
   ```
   *(Feel free to use `nodemon` if you're making edits).*

## Authentication (Mocked)
I intentionally skipped wiring up a full JWT/bcrypt flow so I could focus entirely on the RBAC and core logic. 

To simulate a logged-in user, I set up a custom middleware. Just pass this in your request headers:
```text
x-user-id: <valid_mongodb_user_id>
```
The app will grab that ID, look up the user's role, and apply the correct permissions.

## API Overview

### Records (`/api/records`)
* `GET /` - Grabs the financial records. You can filter the results using query params (e.g., `?type=income&category=Salary`). 
  * *Access: viewer, analyst, admin*
* `POST /` - Creates a new record. 
  * *Access: analyst, admin*
* `DELETE /:id` - Drops a record from the database. 
  * *Access: admin only*

### Dashboard (`/api/dashboard`)
* `GET /summary` - Does the heavy lifting for the frontend analytics. It returns total income, total expenses, net balance, category breakdowns, and a list of recent transactions.
  * *Access: analyst, admin*

## Design Decisions & Assumptions

* **No Service Layer:** I kept the business logic directly inside the controllers. For a project of this size, adding a dedicated service layer usually just means passing data back and forth for no real benefit.
* **Pagination:** I put a hard limit on the record fetching just to prevent dumping the entire database into a single response. If this were a production app, I'd implement proper cursor-based pagination.
* **Validation:** I stuck to basic manual `if/else` checks for the incoming request bodies. Pulling in a heavy validation library like Joi or Zod felt like overkill for these specific endpoints.

## Wrap up
The goal here wasn't to build a fully production-ready system, but rather to show how I approach backend structure, data handling, and access control in a clean and readable way. Hope it makes sense!
