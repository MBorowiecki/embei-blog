# Overview
Embei Blog is a free to use software created to help people create their own blogs.

# Installation
1. Clone `main` branch
```
git clone https://github.com/MBorowiecki/embei-blog.git
```
2. Run `npm install` in main directory
3. Create `.env` file which contains:
```
JWT_SECRET=yourserversecretkey
```
4. Create `config/db.js` file which contains:
```
const username = 'username';
const password = 'password';
const dbName = 'database_name';
const host = 'database_host'

module.exports = {
    username,
    password,
    dbName,
    host
}
```
5. Run `npm start` to start server and voila, you have your own blog server

# Custom routes
If you want to create your own routes, please follow the pattern I started.
Create your file containing unique routes and functions for these routes ie. `posts.js`.
Add your route file to `app.js` in root folder of project
```
app.use(`/api/${APIVersion}/routesName/`, yourRoutesImport);
```
That's all. You can now connect to your custom routes.
