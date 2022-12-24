import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import ReservationsNew from "../reservations/ReservationNew";
import NewTables from "../Tables/NewTables";
import Search from "./Search";
import ReservationsEdit from "../reservations/ReservationsEdit";
import ReservationSeat from "../reservations/ReservationSeat";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/edit">
        <ReservationsEdit />
      </Route>
      <Route exact={true} path="/reservations/:reservationId/seat">
        <ReservationSeat />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route exact path="/reservations/new">
        <ReservationsNew />
      </Route>
      <Route exact path="/tables/new">
        <NewTables />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
