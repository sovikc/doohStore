# oohMedia
An inventory of physical display panels installed in shopping centres

## Approach
A mix of ideas from Domain-driven design and Uncle Bob's Clean Architecture

## Low-level design
![alt text](https://github.com/sovikc/oohMedia/blob/master/low_level_design.png)

## Naming convention
1. The top-level directories **ims** and **db** have short meaningful names for devs to refer easily during daily conversations.
2. The modules in the sourcecode have domain-specific names so that the domain vocabulary is well-represented, such as inventory (housing domain entities), management (service to manage inventories of centres, assets etc.).
3. The infrastructure specific names are used to give the reviewers an idea what they can expect in the directories, like **postgres** would probably be expected to have SQL related files, whereas **routes** might have authentication middleware and handlers for the routes.

## Design Patterns used
1. **Dependency Injection** - Used to inject Repository implementation to management services and ID Generator into domain entities
2. **Factory** - Used to create domain entities
3. **Adapter** - Used in routes/handler to adapt the services to http request/response

## Code structure and directory layout
1. **inventory** - domain entities like Centre, Location, and Asset. A Centre denotes a shopping centre, or a mall. An Asset represents a physical panel located in a certain Location inside the centre. It also has the Repository and ID generation interfaces, Error declaration and factory functions for the entities and validators. 
2. **management** - domain services for managing centres and assets along with their allocation and deallocation.
3. **postgres** - database related code.
4. **id** - code for ID generation.
5. **routes** - route handling, request/response adapter, and user authentication middleware.
6. **controller** - transformation related code for request/response and invocation of services. 
7. **db/pg.sql** - ddl statements for the tables: shopping_centre, location_within_centre, asset, asset_allocation, and change_log.

## Database tables
1. shopping_centre
2. location_within_centre
3. asset
4. asset_allocation 
5. change_log

## Tests
1. Jest is used as a testing framework.
2. Entity creation rules in the inventory have beed tested with centre.spec.ts and asset.spec.ts.
3. Application rules in management services are covered by services.spec.ts.

## What's not done
1. APIs for user registration and login.
2. APIs for searching for Assets
3. User interface

## How to run
1. The code is dockerized and can easily be run with docker-compose
2. The code has following APIs that can be used
```
   GET          /
   
   POST         /centres
   {
    "name": "Goldolfer",
    "address": {
      "lineOne": "500 Moore Street",
      "city": "Lancabin",
      "state": "Lower Brocci",
      "postCode": "500023",
      "country": "Isle of Grand Fenwick"
      }
    }

   GET          /centres/:id

   PATCH        /centres/:id
   {
    "name": "Northwind",
    "address": {
      "lineOne": "273 Kelvin Street",
      "lineTwo": "Beside Dallybin",
      "city": "Lancabin",
      "state": "Top Bristol",
      "postCode": "700029",
      "country": "Isle of Grand Fenwick"
      }
    }

   DELETE       /centres/:id

   POST         /centres/:id/locations
   {
    "code": "L234"
   }

   PATCH        /centres/:id/locations/:locationId
   {
    "code": "5L1234"
   }

   DELETE       /centres/:id/locations/:locationId

   POST         /assets
   {
    "name": "Sign-01-1230-1050-0200",
    "length": 12.30,
    "breadth": 10.5,
    "depth": 2,
    "active": true
   }

   PATCH        /assets/:id
   {
    "active": false
   }

   POST         /assets/:id/allocate
   {
    "centreId" : "ckfi984yc0000ve0f8mpo9qjs",
    "locationCode": "L234"
   }

   DELETE       /assets/:id/allocate
```
3. The server will run of port 8080 in the localhost and the request needs 2 headers `auth-token` with value `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrZjg2cm9sNzAwMDF6MTBmYjNveTNwaDUiLCJpYXQiOjE2MDA1OTY3MTB9.bbGI82--q4U9WIdn4KhAHuVlK4XpkG0moKm6lUPWEww` and `content-type`with value `application/json`

