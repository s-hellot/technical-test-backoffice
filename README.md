# Technical test

This is a full-stack web application built with:

- **Back-end**: [Fastify](https://www.fastify.io/) (Node.js)
- **Front-end**: [Vue 3](https://vuejs.org/) (Options API)
- **Database**: [MongoDB](https://www.mongodb.com/)

---

## Launching the App

To start the project locally, simply run:

```bash
docker-compose up --build
```

This will start:

- the Fastify server with a Swagger at [http://localhost:3000/docs](http://localhost:3000/docs)  
- the Vue 3 front-end at [http://localhost:5173](http://localhost:5173)  
- a MongoDB database and a Mongo Express interface at [http://localhost:8081](http://localhost:8081)

---

### Default Admin Login

When the app starts, it automatically creates a default admin user:

- **Email**: `admin@admin.com`  
- **Password**: `admin`

Use these credentials to log in and start using the app.