# Stock/Forex Price API

A backend beginner's side project based on Finnhub API

* With user-provided finnhub token, the API will call finnhub API and display neat stock information (in JSON)
* Users can create their own watchlists, and set it to private or public
* Show stock chart (rank by popularity, total queries, name, ticker, current price, volumn)
* List users' held stocks and revenue

## TODOs

* PUT v.s. PATCH
* Create stock list (stock name, company, ticker)
* Auth
* Logging
* Versioning

* Multi-threading update? (A and B are trying to follow the same ticker at the same time.)

## Goals

* Users are allowed to create accounts with unique finnhub token.
* Provide a simple and convienient way to allow users to fetch information of stock/forex in their watchlists.
* Users are allowed to (batch) update stock/forex watchlists. (PUT?)
* Users are allowed to delete their accounts.
* Users are allowed to set their profile to public or private (default: private).
* Users are allowed to follow public profiles.
* Provide charts of on popular stocks, forex, usernames.
* Users are allowed to save held amount and prices in private, so there will be revenue and yield to show. (Call Finnhub API by users' tokens)
* Users are allowed to set ideal and private prices of stocks/forex and get notified daily when the market price meets the ideal price. (through email?) -> Check everyday after 4 pm UTS.

### Questions

* How to save information (held amount/price, ideal price) in private?
  * Use bcrypt module
* How to build the base stock/forex collections?
  * Fetch information from finhub API and save it in JSON seperately.
* If multiple users want to fetch the same stock/forex price at the same time, what shoule I do to improve the performance?
  * Check the Price collection before calling Finnhub with user's token. If there's the wanted prices updated within 10 (?) minutes, fetch the data from database, otherwise call Finnhub API.
  * If the time frame is outside of trading hours (9:30 am to 4 pm on weekdays) or is on a stock market holiday, directly fetch data from database.
  * Note: Summer Time

## Object Models

### User

* id
* username
* email
* password
* finnhubToken
* public
* stocks

  * ticker
    * heldAmount
    * heldPrice
    * idealPrice

* forex

  * symbol
    * heldAmount
    * heldPrice
    * idealPrice

* followingUsers
* followedBy
* profit
* proficPercent

### Stock (Generated from JSON)

* id (= finhub id? ticker?)
* count
* price
* updatedAt

### Forex (Generated from JSON)

* id (=finhub id? ticker?)
* count
* price
* updatedAt

## Routers and Test Suites

### /users

* **POST** /users - Create a new account
* **PATCH** /users - Update user profile
* **GET** /users - Fetch user profile
* **DELETE** /users - Delete the current user

* **GET** /users/stocks - Get stock prices and profits in user's watchlist
* **GET** /users/forex - Get forex prices and profits in user's watchlist

* **GET** /users/followings - Get stock/forex prices in following users' watchlists, rank by popularity/price/ticker

      {
      ticker1: {
        price: xxx,
        updateAt: xxx,
        inWatchlist: boolean, 
        followedBy: [userA, userB, ...]
      }, 
      ticker2: {...}
      }

* **PATCH** /users/followings - Add public users into following list by usernames
  * Parameters: users (A and A,B,C)
* **DELETE** /users/followings - Delete public users from following list by usernames
  * Parameters: users (A and A,B,C)

### /charts

* **GET** /charts/stocks - Get stocks chart rank by popularity
* **GET** /charts/forex - Get forex chart rank by popularity
* **GET** /charts/users - Get users chart rank by popularity

### /stocks

* **PUT** /stocks - (Batch) update stock from user's watchlist
* **GET** /stocks - Get stock prices
  * Default: Stock prices rank by popularity
  * Parameters:
    * ticker (A and A,B,C)
    * user (me or other public usernames)
* **DELETE**: /stocks - (Batch) delete stock from user's watchlist

### /forex

------

## New Features

* ETF
  * [ETF Database](https://etfdb.com/screener/)
