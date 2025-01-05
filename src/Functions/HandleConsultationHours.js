export const getTimeConsultaion = (object, list) => {
  const getTime = list.find((item) => item.Name === object.shift);
  if (getTime) {
    return { shift: getTime.Name, shiftId: getTime.Id };
  }
};
