type objectType = {
  [key: string]: any;
};

// Returns a date in the following format: Day Month YYYY
export const getDate = (date: string) => {
  const date_value = new Date(date);
  const options: objectType = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // Format the date according to the options
  const formattedDate = date_value.toLocaleDateString('en-US', options);
  return formattedDate;
};

export const getDateTime = (dateTime: string) => {
  const date_value = new Date(dateTime);
  const options: objectType = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  // Format the date according to the options
  const formattedDate = date_value.toLocaleDateString('en-US', options);
  return formattedDate;
};
