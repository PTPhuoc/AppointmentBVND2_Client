export const listDay = [
  { day: "Thứ 2", id: 1 },
  { day: "Thứ 3", id: 2 },
  { day: "Thứ 4", id: 3 },
  { day: "Thứ 5", id: 4 },
  { day: "Thứ 6", id: 5 },
  { day: "Thứ 7", id: 6 },
  { day: "Chủ Nhật", id: 0 },
];

export const stringDay = (value) => {
  const day = listDay.find((items) => items.id === value);
  return day.day;
};

export const intDay = (value) => {
  const day = listDay.find((items) => items.day === value);
  return day.id;
};

export const formatDate = (eachDate) => {
  const convertDate = new Date(eachDate);
  return (
    convertDate.getDate() +
    "/" +
    (convertDate.getMonth() + 1) +
    "/" +
    convertDate.getFullYear()
  );
};

export const UTCTimeToString = (value) => {
  const valueDate = new Date(value);
  const hours = String(valueDate.getUTCHours()).padStart(2, "0");
  const minutes = String(valueDate.getUTCMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const compareDate = (date, targetDate) => {
  date.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  return date >= targetDate;
};

export const compareUTCTime = (date, targetDate) => {
  const timeA =
    date.getUTCHours() * 3600 +
    date.getUTCMinutes() * 60 +
    date.getUTCSeconds();
  const timeB =
    targetDate.getUTCHours() * 3600 +
    targetDate.getUTCMinutes() * 60 +
    targetDate.getUTCSeconds();
  return timeA >= timeB;
};

export const compareUTCTimeNoEqual = (date, targetDate) => {
  const timeA =
    date.getUTCHours() * 3600 +
    date.getUTCMinutes() * 60 +
    date.getUTCSeconds();
  const timeB =
    targetDate.getUTCHours() * 3600 +
    targetDate.getUTCMinutes() * 60 +
    targetDate.getUTCSeconds();
  return timeA > timeB;
};

export const compareUTCTimeVsLocalTime = (UTCdate, localDate) => {
 
  const timeA =
    UTCdate.getUTCHours() * 3600 +
    UTCdate.getUTCMinutes() * 60 +
    UTCdate.getUTCSeconds();
  const timeB =
    localDate.getHours() * 3600 +
    localDate.getMinutes() * 60 +
    localDate.getSeconds();
  return timeA >= timeB;
}

export const converUTCDate = (dateString) => {
  const date = new Date(dateString)
  return Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

export const handleSlot = (date, targetDate, maxTime) => {
  const timeDifference = targetDate - date;
  const differenceInMinutes = Math.floor(timeDifference / (1000 * 60));
  const result = Math.floor(differenceInMinutes / maxTime);
  return result;
};

export const stringUTCTime = (date) => {
  return (
    String(date.getUTCHours()).padStart(2, "0") +
    ":" +
    String(date.getUTCMinutes()).padStart(2, "0")
  );
};
