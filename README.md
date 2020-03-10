# Stock Price API

Track stock prices and FX in user's favorite list.

## Object Models

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
