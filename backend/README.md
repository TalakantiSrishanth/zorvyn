# FinTrack Backend

A simple Node.js + Express backend for a finance dashboard.
It manages financial records, basic user roles, and provides some aggregated data for a dashboard view.

Nothing overcomplicated — just focused on getting the core backend logic working cleanly.

---

## Tech Stack

* Node.js
* Express.js
* MongoDB (Mongoose)

---

## Running the Project

1. Make sure MongoDB is running locally (or update `MONGO_URI` if you're using Atlas).
2. Install dependencies:

   ```
   npm install
   ```
3. Start the server:

   ```
   node server.js
   ```

   (or use nodemon if you prefer)

---

## Authentication (Mock)

Authentication is kept simple on purpose.

Instead of setting up JWT, I used a custom header:

```
x-user-id
```

Just pass a valid user ID from the database in the header to simulate a logged-in user.

---

## APIs

### Records (`/api/records`)

* `GET /`
  Fetch records (supports filters like `?type=income&category=Salary`)
  Roles: viewer, analyst, admin

* `POST /`
  Create a new record
  Roles: analyst, admin

* `DELETE /:id`
  Delete a record
  Roles: admin

---

### Dashboard (`/api/dashboard`)

* `GET /summary`
  Returns:

  * total income
  * total expenses
  * net balance
  * category breakdown
  * recent transactions

  Roles: analyst, admin

---

## Notes / Assumptions

* **Auth is mocked**
  Didn’t implement full JWT flow to keep focus on RBAC and core logic.

* **No service layer**
  For this size of project, keeping logic in controllers felt simpler and easier to follow.

* **Pagination**
  Currently limiting results to avoid large responses.
  Proper pagination can be added later if needed.

* **Validation**
  Used basic manual checks instead of adding extra libraries.

---

## Final Thoughts

The goal here was to keep things simple but structured —
not production-level, but clean enough to show backend design, RBAC, and data handling.
