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
              <option>Please Select A Table</option>
              {tables.map((table) => {
                return (
                  <option key={table.table_id} value={table.table_id}>
                    Table Name: {table.table_name} - Table Capacity:
                    {table.capacity}
                  </option>
                );
              })}
            </select>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default ReservationSeat;
