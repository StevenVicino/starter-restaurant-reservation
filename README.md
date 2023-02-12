# Restaurant Reservation App

This application is used by the restaurant staff. When a customer calls, the employee can record their information, search by phone number or date, can seat them at a table when they arrive and free the table when the party leaves. The app implements react router and express to build a RESTful API in order to make HTTP requests for all of the reservation data stored on the connected PostgreSQL database. It also utilizes CRUD functions and knex queries to handle data going to and coming from the database.

## Technology

- React
- Node.js
- Express
- Knex
- PostgreSQL

## Screenshots

**Dashboard**
- Defaults to displaying a list of reservations for the current date and displays a list of the current tables.
- Can navigate between days using previous, today and next day buttons.
- Includes a menu as a sidebar to make navigation through the site easier.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/dashboard-image.png)

**Edit**
- Edit reformation form.
- Form has current information prefilled out.
- Cancel button includes a window confirmation pop up.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/edit-image.png)

**New Reservation**
- Page that creates a new reservation.  Includes error message if form filled out incorrectly.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/new-reservation-image.png)

**New Table**
- Page that creates a new table.  Includes error message if form filled out incorrectly.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/new-table-image.png)

**Search**
- Searches for reservations based on phone number.  Partial or full numbers acceptable.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/search-image.png)

**Seat**
- Can choose from a dropdown list of tables where the reservation should be seated.
- Error message included if the table is too small for the party or if the table is already occupied.

![image](https://github.com/StevenVicino/starter-restaurant-reservation/blob/main/images/seat-image.png)
