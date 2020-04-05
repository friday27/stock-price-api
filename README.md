# Stock/Forex Price API

A backend beginner's side project based on Finnhub API

## TODOs

* Create stock/forex collections (price model) while deploying

* Test suites and routers
  * user [done]
  * stock [done]
  
  * forex [done]
  * chart

  * Issues
    * delete user -> delete fx/stock data
    * symbol issue: FXCM:USD/HKD (use it in POST and DELETE test cases)

  * TODOs
    * add sortBy to /stocks, /fx
    * setupDatabase
      * create price collection
    * routers/stock.js -> add time constrains to get /stocks (if it's bank holiday or off hours, do not update price info)
    * /stocks next: support searching for multiple tickers
    * GET /fx: adjust output format

* Logging
* Versioning

* Clean up files

* Multi-threading update? (A and B are trying to follow the same ticker at the same time.)

* Automaticallly update Price collection
  * Stock/forex symbols

### Questions

## Goals

* Users are allowed to create accounts with unique finnhub token.
* Users are allowed to update and delete their accounts.
* Users are allowed to set their profile to public or private (default: private).
* Users are allowed to save held amount and prices in private, so there will be revenue and yield to show. (Call Finnhub API by users' tokens)

* Users are allowed to (batch) update stock/forex watchlists.
* Users are allowed to fetch price information of stock/forex in their watchlists.

* Provide charts of on popular stocks, forex, usernames.

### Discussion

* How to save information (held amount/price, ideal price) in private?
  * Use bcrypt module

* How to build the base stock/forex collections?
  * Fetch information from finhub API and save it in JSON seperately.

* If multiple users want to fetch the same stock/forex price at the same time, what should I do to improve the performance?
  * Check the Price collection before calling Finnhub with user's token. If there's the wanted prices updated within 10 (?) minutes, fetch the data from database, otherwise call Finnhub API. -> Lock this DS?
  * If the time frame is outside of trading hours (9:30 am to 4 pm on weekdays) or is on a stock market holiday, directly fetch data from database. (Note: Summer Time)

## Object Models

### User

* ObjectID  id
* String    name (required)
* String    email (required)
* String    password (required)
* String    finnhubToken (required)
* Boolean   public (default: false)
* Array     jwt

### Price (A collection of all investment tools (stock/forex), which is pre-generated from JSON.)

* ObjectID  id
* String    symbol (unique)
* String    displaySymbol
* String    exchange
* String    type (stock/forex)
* String    description
* String    country
* String    currency
* Number    price (in US dollars)
* Number    popularity (the number of people who are watching this stock/forex)
* Date      updatedAt

### Stock (1 document = all transactions of the stock for the user)

* ObjectID  id
* ObjectID  userId
* String    ticker
* Number    cost
* Number    amount

### Forex

* ObjectID  id
* ObjectID  userId
* String    symbol
* String    exchange
* Number    cost
* Number    amount

## Routers and Test Suites

### /users

* **POST**    /users - Create a new user account with unique Finnhub API token
* **DELETE**  /users - Delete the user account
* **PATCH**   /users - Update user profile
* **GET**     /users - Get user profile
* **POST**    /users/login - Login and get a JSON Web Token
* **POST**    /users/logout - Logout and remove the JSON Web Token

### /stocks

* **POST**    /stocks - Add buying (amount > 0)/ selling (amount < 0) records of stocks on the specific price and amount, or add the ticker into watchlish without price and amount.
* **DELETE**  /stocks - Remove tickers from watchlist if the held amount = 0.

* **GET**     /stocks/ticker?q=symbol - Return the stock information
* **GET**     /stocks/chart - Get stock chart, sortBy: ticker(symbol), price, popularity, country, currency, filterBy: ticker(symbol), price(greater than, smaller than), popularity, country, currency

* **GET**     /stocks - Get the user's stock watchlist with calculated profit and return(%).

### /forex

* **POST**    /fx - Add forex into the user's watchlist without cost/amount
* **DELETE**  /fx - Remove forex from the user's watchlist
* **GET**     /fx - Get the user's forex watchlist with calculated profit and return(%). If the parameter symbols is set (`/fx?symbols=AAA`), return the forex information without profit and return.
* **GET**     /fx/chart - Get fx chart, sortBy: symbol, displaySymbol, exchange, price, popularity

#### Test Cases - Charts

* Should get stocks chart (default: sortBy=popularity)
* Should get stocks chart (sortBy=name)
* Should get stocks chart (sortBy=price)
* Should get forex chart (default: sortBy=popularity)
* Should get forex chart (sortBy=name)
* Should get forex chart (sortBy=price)
* Should not get charts with the parameter sortBy other than {name, price, popularity}
* Should not get charts with the parameter type other than {stock, forex}
* Should not get stocks chart without authentication
* Should not get forex chart without authentication

------

## New Features

* Recommend System: Recommend stocks the user might be interested in by comparing on his/her watchlish to others.
  * Calculated daily

* ETF
  * [ETF Database](https://etfdb.com/screener/)
