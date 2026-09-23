export const formatDate = (dateString: string, noD = false) => {
  const d = new Date(dateString);
  const date = d.getDate();
  const day = d.getDay();
  const month = d.getMonth();
  const year = d.getFullYear();
  const months = [
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ];
  const days = [
    'dimanche',
    'lundi',
    'mardi',
    'mercredi',
    'jeudi',
    'vendredi',
    'samedi',
  ];
  if (noD) return ` ${date} ${months[month]} ${year} `;
  return ` ${days[day]} ${date} ${months[month]} ${year} `;
};

export const parseDateFR = (dateString: string) => {
  const [day, month, year] = dateString.split('/');
  const paddedDay = day.padStart(2, '0');
  const paddedMonth = month.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
};
