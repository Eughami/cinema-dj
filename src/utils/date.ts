export const formatDate = (dateString: string, noD = false) => {
  const d = new Date(dateString);
  const date = d.getDate();
  const day = d.getDay();
  const month = d.getMonth();
  const year = d.getFullYear();
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  if (noD) return ` ${date} ${months[month]} ${year}`;
  return ` ${days[day]} ${date} ${months[month]} ${year}`;
};

export const parseDateFR = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  return `${year}-${month}-${day}`;
};
