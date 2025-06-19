
#  Express Products API

This is a RESTful API built with Express.js that supports full CRUD functionality for managing products, with middleware for logging, authentication, validation, and error handling.

---

##  Getting Started

###  Install Dependencies

```bash
npm install
````

###  Create a `.env` file

Create a `.env` file and add your variables:

```env
PORT=3000
API_KEY=mysecretkey
```

###  Run the Server

```bash
node server.js
```

The server will start on:
`http://localhost:3000`

---

##  API Endpoints

| Method | Endpoint               | Description               |
| ------ | ---------------------- | ------------------------- |
| GET    | `/`                    | Welcome message           |
| GET    | `/api/products`        | List all products         |
| GET    | `/api/products/:id`    | Get product by ID         |
| POST   | `/api/products`        | Create a new product      |
| PUT    | `/api/products/:id`    | Update a product          |
| DELETE | `/api/products/:id`    | Delete a product          |
| GET    | `/api/products/search` | Search products by name   |
| GET    | `/api/products/stats`  | Product stats by category |

> Routes with `POST`, `PUT`, and `DELETE` require an API key in the request headers:
>
> ```
> x-api-key: mysecretkey
> ```

---

##  Example Request & Response

### Create a Product (POST `/api/products`)

**Request Body:**

```json
{
  "name": "Tablet",
  "description": "A 10-inch Android tablet",
  "price": 250,
  "category": "electronics",
  "inStock": true
}
```

**Response:**

```json
{
  "id": "generated-uuid",
  "name": "Tablet",
  "description": "A 10-inch Android tablet",
  "price": 250,
  "category": "electronics",
  "inStock": true
}
```


##  .env.example

```env
PORT=3000
API_KEY=mysecretkey

```


##  Author

Grace Okailey Quaye – Week 2 Express.js Assignment


