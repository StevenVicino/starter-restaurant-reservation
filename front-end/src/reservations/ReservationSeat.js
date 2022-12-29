import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTable, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function ReservationSeat() {
  const { reservationId } = useParams();

  const history = useHistory();

  const [error, setError] = useState(null);
  const [tables, setTables] = useState(null);
  const [tableId, setTableId] = useState(0);

  useEffect(() => {
    async function loadTables() {
      const abortController = new AbortController();
      listTable(abortController.signal).then(setTables);
      return () => abortController.abort();
    }
    loadTables();
  }, []);

  const handleChange = ({ target }) => {
    setTableId(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    if (tableId === 0) {
      return setError(new Error("Please Select a Table"));
    }
    seatReservation(reservationId, tableId, abortController.signal)
      .then(() => history.push(`/dashboard`))
      .catch((error) => {
        setError(error);
      });
    return () => abortController.abort();
  };

  if (!tables) {
    return <h1>Loading...</h1>;
  } else {
    return (
      <div>
        <h1 className="text-center bg-secondary">Seat A Reservation</h1>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit}>
          <label htmlFor="tableNumber">
            Select Table Number:
            <select
              className="form-select"
              name="table_id"
              onChange={handleChange}
              value={tableId}
            >
              <option value={0}>Please Select A Table</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} value={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                );
              })}
            </select>
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default ReservationSeat;
