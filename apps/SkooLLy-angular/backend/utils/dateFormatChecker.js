exports.checkSpecificDateFormat = (dateString) =>  {
  // Regex to check the format structure YYYY-MM-DD
  if (!dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return false;
  }

  // Split and convert to numbers
  const parts = dateString.split('-').map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  // JavaScript months are 0-based, so subtract 1
  const date = new Date(year, month - 1, day);

  // Check if the created date's components match the input components.
  // This handles leap years and month-day boundaries (e.g., Feb 30th)
  const isValid = date.getFullYear() === year && 
                    date.getMonth() === month - 1 && 
                    date.getDate() === day;
  
  if (isValid) {
    //   console.log(`"${dateString}" is valid.`);
      return true
  } else {
    //   console.log(`"${dateString}" is invalid.`);
      return false
  }
  
}

