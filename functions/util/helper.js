function validateInput(inputObject, res) {
  // return [] if empty => no missing
  let errors = [];
  for (const [key, value] of Object.entries(inputObject)) {
    if (typeof value == "undefined") errors.push(key);
  }
  return errors;
}

module.exports = { validateInput };
