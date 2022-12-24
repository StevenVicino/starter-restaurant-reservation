import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTable,
  finishTable,
  editReservationStatus,
} from "../utils/api";
import { previous, next, formatAsDate, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState(date);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [reservationDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTable(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  const reservationList = (
    <ul>
      {reservations.map((reservation) => {
        return (
          <li key={reservation.reservation_id}>
            <div className="row">
              <div className="col">{reservation.first_name}</div>
              <div className="col">{reservation.last_name}</div>
              <div className="col">{reservation.mobile_number}</div>
              <div className="col">{reservation.reservation_date}</div>
              <div className="col">{reservation.reservation_time}</div>
              <div className="col">{reservation.people}</div>
              <div className="col">{reservation.status}</div>
              {reservation.status === "booked" ? (
                <Link
                  type="button"
                  to={`/reservations/${reservation.reservation_id}/seat`}
                >
                  Seat
                </Link>
              ) : null}
              {reservation.status === "booked" ? (
                <Link
                  className="button"
                  to={`/reservations/${reservation.reservation_id}/edit`}
                >
                  Edit
                </Link>
              ) : null}
              {reservation.status === "cancelled" ? null : (
                <button
                  type="button"
                  data-reservation-id-cancel={reservation.reservation_id}
                  onClick={() => handleCancel(reservation.reservation_id)}
                >
                  Cancel
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
  async function handleCancel(reservationId) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );
    if (result) {
      await editReservationStatus(
        "cancelled",
        reservationId,
        abortController.signal
      );
      loadDashboard();
    }
    return () => abortController.abort();
  }

  async function handleFinish(table_id) {
    const abortController = new AbortController();
    const result = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (result) {
      await finishTable(table_id, abortController.signal);
      loadDashboard();
    }
    return () => abortController.abort();
  }

  const tableList = (
    <ul>
      {tables.map((table) => {
        return (
          <li key={table.table_id}>
            <div className="row">
              <div className="col">{table.table_name}</div>
              <div className="col">{table.capacity}</div>
              <div className="col">{table.reservation_id}</div>
              <div className="col">{table.status}</div>
              {table.status === "Occupied" ? (
                <button
                  data-table-id-finish={table.table_id}
                  type="button"
                  onClick={() => handleFinish(table.table_id)}
                >
                  Finish
                </button>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <main>
      <h1>Dashboard</h1>
      <button
        type="button"
        onClick={() => setReservationDate(previous(reservationDate))}
      >
        Previous Day
      </button>
      <h1>{formatAsDate(reservationDate)}</h1>
      <button type="button" onClick={() => setReservationDate(today())}>
        Today
      </button>
      <button
        type="button"
        onClick={() => setReservationDate(next(reservationDate))}
      >
        Next Day
      </button>
      <br />
      <div className="d-md-flex mb-3">
        <h2 className="mb-0">Reservations for date</h2>
        <div className="container">{reservationList}</div>
        <br />
        <h2 className="mb-0">Tables:</h2>
        <div className="container">{tableList}</div>
      </div>
      <ErrorAlert error={reservationsError} />
    </main>
  );
}

export default Dashboard;
