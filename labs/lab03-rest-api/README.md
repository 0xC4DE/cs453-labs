# Lab 3 - REST API with Express
## Overview
In this lab, I built a small REST-style API using Express.

This application implements an API for managing a small in-memory collection of items. The data is not stored in a database, and is volitile. 

I also added vitest to the 
Pelase note the method I use for testing.

## Features
This API manages a collection of items.

Each item has the following fields:
```
{
  "id": 1,
  "name": "keyboard",
  "quantity": 10
}
```

The server has the following routes:

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | /health | Return a simple health check response |
| GET | /items | Return all items |
| GET | /items/:id | Return one item by ID |
| POST | /items | Create a new item |
| PUT | /items/:id | Update an existing item |
| DELETE | /items/:id | Delete an existing item |

 openapi.yaml file that describes the API is included.

## Endpoint Behavior
`GET /health` should return:

```
{
  "status": "ok"
}
```
`GET /items` returns an array of items.

`GET /items/:id` returns the matching item if it exists. If the item does not exist, return a 404 response.

`POST /items` creates a new item. The client should send a JSON request body with name and quantity. The server should assign the id.

Example request body:

```
{
  "name": "monitor",
  "quantity": 4
}
```

`PUT /items/:id` updates an existing item. If the item does not exist, return a 404 response.

`DELETE /items/:id` deletes an existing item. If the item does not exist, return a 404 response.

Your API should return reasonable error messages as JSON.

Example error response:
```
{
  "error": "Item not found"
}
```

## Testing

Tests have been implemented in this project.

They verify the following:
* `GET /health` returns `{ "status": "ok" }`.
* `GET /items` returns a list of items dependent on what is inserted.
* `POST /items` creates a new item.
* `GET /items/:id` can retrieve an item by ID.
* `PUT /items/:id` updates an item by ID.
* `DELETE /items/:id` deletes an item by ID.
* A missing item returns `404`.

These tests are run like the following:
1. In one terminal, `npm run server`
2. In another terminal, `npm test`



## Reflection Questions

What makes this API more “REST-like” than the previous HTTP/JSON lab?

RESTful API's depend on the idea of "managing resources", so in this lab each endpoint that accessess the items are managing the items resource. Using the different methods against the items endpoint is the essence of what makes this API RESTful.


What is the purpose of a route parameter such as /items/:id?

Accessing the item that belongs to that specific ID.


Why should POST, PUT, and DELETE use different HTTP methods?

Combining these can be cluttered. Separating these makes it very clear which function is used and when, while better defining the management method for the resource.


What is the difference between a 400 error and a 404 error?

400 is BAD_REQUEST meaning you either provided invalid form data or just incorrectly formatted form data. 404 is NOT_FOUND which is used for when the page just doesn't exist. This can be because the resource doesn't exist or because you're hitting an endpoint that doesn't exist.


How does the OpenAPI file relate to your Express server code?

It's a direct declarative definition of what the API/server code does.


## Graduate Extension
Graduate students should complete one additional feature.


- Add validation so quantity must be a number greater than or equal to zero.
My insert the number must be greater than zero.


- Add a PATCH /items/:id route for partial updates.
This was implemented as part of my checking against invalid form data, quantity OR name can be updated, or both.