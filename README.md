# Stock Price API

Track stock prices in user's favorite list.

* With user-provided finnhub token, the API will call finnhub API and display neat stock information (in JSON)
* Users can create their own watchlists, and set it to private or public
* Show stock chart (rank by popularity, total queries, name, ticker, current price, volumn)
* List users' held stocks and revenue

## Schedule

* 3/27 ~ 3/29 Design
* 3/30 ~ 4/07 TDD & Coding
* 4/08 ~ 4/09 Documents

## TODOs

* Create stock list (stock name, company, ticker)
* Automatically fetch the prices and volumns after 4 pm on weekdays

* Auth
* Logging
* Versioning

## Object Models

### Stock - Generated in advance

* Object id
* (Required)   String ticker
* (Required)   String name
* (Required)   String company
* (Default: 0) Number popularity
* (Default: 0) Number queries
* (Default: 0) Number last-close-price
* (Default: 0) Number last-close-volume

### User

* ObjectID id
* (Required)       String username
* (Default: false) String public-stock (Since there'll be FX watchlist in the future, users should be allowed to set privacy seperately)
* (Default: [])    Array(Object) stocks/ideal-price/held/held-price

## Routers

### {{url}}/stock/

* `GET /stocks/` List information of tickers in the user's favoriye list
* `GET /stocks/:ticker` Get the information of the specific ticker
* `POST /stocks/:ticker` Add a ticker to user's favorite list
* `DELETE /stocks/:ticker` Delete a ticker from the user's favorite list

### {{url}}/fx/

### {{url}}/users/

* `POST /users/` Create a new user
* `POST /users/login`
* `POST /users/logout`
* `PATCH /users/me` Update user's info
* `DELETE /users/me` Delete a user

## New Features

* FX information
* Notify users when stocks in their watchlist meet the ideal price
* Line chart
* Taiwan stock information
