import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import tableValidProps from "./tableValidProps";

function NewTables() {
  const { tableId } = useParams();
  const initialTable = {
    table_name: "",
    capacity: 1,
    status: "free",
    table_id: tableId,
  };

  const history = useHistory();

  const [table, setTable] = useState({ ...initialTable });
  const [error, setError] = useState(null);

  const handleChange = ({ target }) => {
    setTable({
      ...table,
      [target.name]:
        target.name === "capacity" && target.value
          ? Number(target.value)
          : target.value,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const errors = tableValidProps(table);
    if (errors.length) {
      setError(errors);
    } else {
      createTable(table, abortController.signal)
        .then(() => {
          history.push("/dashboard");
        })
        .catch(setError);
    }
    return () => abortController.abort();
  };

  return (
    <form onSubmit={handleSubmit}>
      <ErrorAlert error={error} />
      <label htmlFor="table_name">
        Please Enter the Table Name:
        <input
          id="table_name"
          type="text"
          name="table_name"
          onChange={handleChange}
          value={table.table_name}
        />
      </label>
      <label htmlFor="capacity">
        Please Enter Capacity:
        <input
          id="capacity"
          type="number"
          name="capacity"
          onChange={handleChange}
          value={table.capacity}
        />
      </label>
      <button type="submit">Submit</button>
      <button type="cancel" onClick={() => history.go(-1)}>
        Cancel
      </button>
    </form>
  );
}

export default NewTables;
