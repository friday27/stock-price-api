# Stock/Forex Price API

A backend beginner's side project based on Finnhub API

## TODOs

* Create stock/forex collections (price model) [done]
* models
  * user
  * stock
  * forex
* tests/fixtures/db.js

* Test suites and routers
  * user
  * stock
  * forex
  * chart

* Update isValidFinnhubToken()
* Fix test case: 'Should not create a user with invalid Finnhub API token' by using empty string

* Auth
* Logging
* Versioning

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

#### Test Cases - Users

* Should create a new user with valid data (set public to false by default, create a jwt, check db) [done]
* Should not create a user with duplicated username [done]
* Should not create a user with invalid email [done]
* Should not create a user with invalid Finnhub API token [done]

* Should delete a user with authentication (check db)
* Should not delete a user without authentication

* Should update user profile with valid data (allow to change: email, password, finnhubToken, public) and authentication (check db)
* Should not update username
* Should not update user profile with invalid email
* Should not update user profile with invalid finnhub token
* Should not update user profile with invalid authentication
* Should not update user profile without authentication

* Should return user profile with authentication
* Should not return user profile without authtication

* Should login with valid username and password
* Should not login with non-existing username
* Should not login with invalid password
* Should logout with authentication (check db: jwt)
* Should not logout without authentication

### /stocks

* **POST**    /stocks - Add stocks into the user's watchlist (with/without heldPrice and heldAmount)
* **PATCH**   /stocks - Add buying (amount > 0)/ selling (amount < 0) records of stocks on the specific price and amount, or add the ticker into watchlish without price and amount
* **DELETE**  /stocks - Remove tickers from watchlist if the held amount = 0
* **GET**     /stocks - Get the user's stock watchlist with calculated profit and return(%). If the parameter tickers is set (`/stocks?tickers=AAA`), return the stock information without profit and return.

#### Test Cases - Stocks

* Should add tickers into user's watchlist with held price and amount (check db)
* Should add tickers into user's watchlist without held price and amount (check db)
* Should not add tickers into user's watchlist with negative held price
* Should not add duplicated ticker into user's watchlish without held price and amount
* Should not add non-exising tickers into user's watchlist
* Should not add tickers into user's watchlist without authentication

* Should add selling records into user profile (check db)
* Should add buying records into user profile (check db)
* Should not add selling records when the stock amount held by the user < selling amount
* Should not add selling records when the amount >= 0
* Should not add selling records with negative price
* Should not add selling records without authentication
* Should not add buying records when the amount <= 0
* Shoule not add buying records with negative price
* Should not add buying records without authentication

* Should delete tickers from user's watchlist if held amount = 0 (check db)
* Should not delete tickers from user's watchlist if held amount > 0
* Should not delete tickers which are not in user's watchlist
* Should not delete tickers from user's watchlist without authentication

* Should get the information of tickers with parameter ticker
* Should not get the information of tickers with parameter ticker but without authentication
* Should get the information of tickers, profits and returns in watchlish without any parameter
* Should not get the information of tickers in watchlish without any parameter nor without authentication

### /forex

* **PATCH**   /forex - Add forex into the user's watchlist `/forex?symbol=GOOG,APPL`
* **DELETE**  /forex - Remove forex from the user's watchlist
* **GET**     /forex - Get the user's forex watchlist with calculated profit and return(%). If the parameter symbols is set (`/forex?symbols=AAA`), return the forex information without profit and return.

#### Test Cases - Forex

Check Test Cases - Stocks

### /charts

* **GET** /charts - Return a chart of the specific type (`/charts?type=stock`). sortBy: name, price, popularity

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
