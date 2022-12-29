import React, { useEffect, useState } from "react";
import {
  listReservations,
  listTable,
  finishTable,
  editReservationStatus,
} from "../utils/api";
import { previous, next, formatAsDate, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { Link, useLocation, useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const location = useLocation();
  const dateQuery = location.search.slice(6);
  const history = useHistory();

  console.log(dateQuery);

  const [reservations, setReservations] = useState([]);
  const [reservationDate, setReservationDate] = useState(date);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadDashboard, [reservationDate]);

  useEffect(() => {
    if (dateQuery && dateQuery !== "") {
      setReservationDate(dateQuery);
    }
  }, [dateQuery, history]);

  //Makes an API and retrieves the Tables and the Reservation information
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTable(abortController.signal).then(setTables);
    return () => abortController.abort();
  }

  //Creates a Reservation Table
  const reservationList = (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>First Name:</th>
            <th>Last Name:</th>
            <th>Phone Number:</th>
            <th>Date:</th>
            <th>Time:</th>
            <th>Guest Number:</th>
            <th>Status:</th>
            <th>Seat:</th>
            <th>Edit:</th>
            <th>Cancel:</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => {
            return (
              <tr key={reservation.reservation_id}>
                <td className="align-middle">{reservation.first_name}</td>
                <td className="align-middle">{reservation.last_name}</td>
                <td className="align-middle">{reservation.mobile_number}</td>
                <td className="align-middle">{reservation.reservation_date}</td>
                <td className="align-middle">{reservation.reservation_time}</td>
                <td className="align-middle">{reservation.people}</td>
                <td
                  className="align-middle"
                  data-reservation-id-status={reservation.reservation_id}
                >
                  {reservation.status}
                </td>
                <td className="align-middle">
                  {reservation.status === "booked" ? (
                    <button>
                      <Link
                        to={`/reservations/${reservation.reservation_id}/seat`}
                      >
                        Seat
                      </Link>
                    </button>
                  ) : null}
                </td>
                <td className="align-middle">
                  {reservation.status === "booked" ? (
                    <button>
                      <Link
                        className="link-dark"
                        to={`/reservations/${reservation.reservation_id}/edit`}
                      >
                        Edit
                      </Link>
                    </button>
                  ) : null}
                </td>
                <td className="align-middle">
                  {reservation.status === "cancelled" ? null : (
                    <button
                      type="button"
                      data-reservation-id-cancel={reservation.reservation_id}
                      onClick={() => handleCancel(reservation.reservation_id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  //Changes reservation status to cancelled.
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

  //Changes table status to free and deletes reservation
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

  //Creates Tables Table
  const tableList = (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Table Name:</th>
            <th>Capacity:</th>
            <th>Status:</th>
            <th>Finish:</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => {
            return (
              <tr key={table.table_id}>
                <td className="align-middle">{table.table_name}</td>
                <td className="align-middle">{table.capacity}</td>
                <td
                  className="align-middle"
                  data-table-id-status={table.table_id}
                >
                  {table.reservation_id ? "occupied" : "free"}
                </td>
                <td className="align-middle">
                  {!table.reservation_id ? null : (
                    <button
                      data-table-id-finish={table.table_id}
                      type="button"
                      onClick={() => handleFinish(table.table_id)}
                    >
                      Finish
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <main>
      <header className="mb-5">
        <h1 className="text-center bg-secondary">Dashboard</h1>
        <h4 className="text-center">{formatAsDate(reservationDate)}</h4>
        <div className="text-center">
          <button
            className="mr-3"
            type="button"
            onClick={() => setReservationDate(previous(reservationDate))}
          >
            Previous Day
          </button>
          <button
            className="mr-3"
            type="button"
            onClick={() => setReservationDate(today())}
          >
            Today
          </button>
          <button
            className="mr-3"
            type="button"
            onClick={() => setReservationDate(next(reservationDate))}
          >
            Next Day
          </button>
        </div>
      </header>
      <ErrorAlert error={reservationsError} />
      <h2 className="text-center mb-1">Reservations For Date:</h2>
      <div className="container">{reservationList}</div>
      <div>
        <h2 className="text-center  mb-1">Tables:</h2>
        <div className="container">{tableList}</div>
      </div>
    </main>
  );
}

export default Dashboard;
