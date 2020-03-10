# Notes

REST APIs are implemented for a **resource** which could be an entity or service. These API’s provide way to identify a resource by its URI, which can be used to transfer a representation of a resource’s current state over HTTP.

## TODOs

* [API Design Patterns and Best Practices](https://www.moesif.com/blog/api-guide/api-design-guidelines/)
* [Microsoft: Web API design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## Steps to Design a REST API

1. Identify object models which will be presented as resources.

2. Create model URLs and assign HTTP methods
  
    * Notice that these URIs do not use any verb or operation. URIs should all be nouns only.

    * URIs are usually in two forms – collection of resources and singular resource.

    * The paths should contain the plural form of resources and the HTTP method should define the kind of action to be performed on the resource.

3. Determine Representations

    * Format: JSON, XML, ...etc.
    * Data represnetations

          {
            ticker: '...',
            company: '...',
            prices: {
              ...
            }
          }

4. More actions

    * Statelesss authenticatoin and security
    * Searching, sorting, filtering and pagination
    * Logging
    * API Document (Swagger, Stripe)
    * Versioning
    * HATEOAS ?

## Some Concepts

* POST v.s. PUT v.s. PATCH

  * POST - Create a new object
  * PUT - Update the object
  * PATCH - Partially upate

## HTTP Status Code

### 2xx - Success

* 200 - OK
* 201 - Created
* 204 - No content (DELETE could use it)

### 4xx - Client Error

* 400 - Bad request
* 401 - Unauthorised
* 403 - Forbidden (authenticated but no access)
* 404 - Not found
* 405 - Method Not Allowed (If the user is trying to violate an API contract, for example, trying to update a resource by using a POST method.)
* 410 - Gone (the requested resource is no longer available)

### 5xx - Server Error

* 500 - Internal server error
* 503 - Service unavailable
