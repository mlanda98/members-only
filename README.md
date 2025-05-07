# members-only

A full-stack web application where members can anonymously post messages. Non-members can see the messages but not the authors. Members see who wrote what. Admins can moderate the content.

---

🚀 Demo

 ![App Demo](dem.gif)

---

📌 Features
- User authentication with Passport.js
- Secure password hashing with bcrypt
- PostgreSQL database with user and message models
- Membership system with a secret passcode
- Admin system for deleting messages
- Anonymous message board (author names visible only to members)
- Server-side form validation and sanitization 

---

🛠️ Tech Stack
- Node.js / Express.js
- PostgreSQl with raw SQL
- EJS templating engine
- Passport.js for authentication
- bcrypt for password hashing
- dotenv for environment configuration

---

📂 Database 
- This project uses a PostgreSQL database with two tables: `users` and `messages`
- The `users` table stores each user's first name, last name, username (used as their login), a hashed password, and whether they are admin.
- The `messages` table stores a title, the message content, a timestamp, and a reference to the user who wrote it.

Each message is linked to a user. If a user is deleted, all the messages are deleted as well.

---

💻 Run It Locally
- Clone the repository
  `git clone https://github.com/mlanda98/members-only.git`
- Navigate into the project directory
  `cd members-only`
- Install dependencies
  `npm install`
- configure environment variables in `.env` file:

```
PGUSER=your_postgres_username
PHOST=localhost
PGDATABASE=members_only
PGPASSWORD=your_postgres_password
PGPORT=5432
NODE_ENV=development
```
- Start the server
  `npm start`
- Open your browser to `http://localhost:3000`

---

📬 Contact
- Email: mlandae16@gmail.com
