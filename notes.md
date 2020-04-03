# Notes

REST APIs are implemented for a **resource** which could be an entity or service. These API’s provide way to identify a resource by its URI, which can be used to transfer a representation of a resource’s current state over HTTP.

## References

* [Get Started with APIs](https://www.moesif.com/blog/api-guide/getting-started-with-apis/)
* [Microsoft: Web API design](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

## # A Good API Should

* Easy to use, hard to misues
* Easy to read and maintain
* Easy to extend

## TDD, Test Driven Development

* [Jest Doc](https://jestjs.io/docs/en/expect.html)

* You can create your test file with **.test.js** extension which will allows jest to locate your file and run your test cases.

* The best practice is test case first then development. [link](https://codeburst.io/test-driven-development-with-jest-37e82ddb3989)

* The theory behind TDD is quite simple, and revolves around 3 steps:

  1. Writing a test for **a small part of a functionality** and checking that this new test is failing (Red step)
  2. Writing the code that makes the test pass, then checking that your previous test and the new one are successful (Green step)
  3. Refactoring the code to make sure it is clear, understandable, and behaves well with the previous functionalities

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
  * PUT - Update the whole object
  * PATCH - Partially upate

* [HTTP Status Code](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

* env-cmd `./node_modules/.bin/env-cmd -f ./config/dev.env node xxx.js`

* Run a single test suite `npm test -- -u -t="stock"`

* Force the name of collection to be xxx using mongoose

      const sthSchema = new mongoose.Schema({...}, {
        timestamps: true,
        // ...
        collection: 'something'
      });

### [File I/O](https://stackabuse.com/writing-to-files-in-node-js/)

* `fs.writeFile()` writes data to files asynchronously.
* `fs.writeFileSync()` performs input/output operations synchronously, blocking the Node.js event loop while the file is written.
* Both `fs.writeFile()` and `fs.writeFileSync()` will create a new file every time or replace all the contents, so we should use `fs.appendFile()` to update an existing file.
