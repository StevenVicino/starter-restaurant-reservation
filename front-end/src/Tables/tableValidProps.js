function tableValidProps(table) {
  const errors = [];
  const { table_name, capacity } = table;
  const props = ["table_name", "capacity"];
  props.forEach((prop) => {
    if (!prop) {
      errors.push(new Error(`A ${prop} property is required.`));
    }
  });
  if (table_name.length < 2) {
    errors.push(
      new Error("table_name must be two characters or more in length")
    );
  }
  if (!Number.isInteger(capacity) || capacity < 1) {
    errors.push(new Error("The capacity must be a number greater than 0"));
  }
  return errors;
}

export default tableValidProps;
