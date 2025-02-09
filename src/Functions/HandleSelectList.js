export const handleList = (list, value, key) => {
  if (value) {
    const filter = list.filter((item) =>
      item[key].toLowerCase().includes(value.toLowerCase())
    );
    if (filter.length > 0) {
      return filter;
    } else {
      return [];
    }
  } else {
    return list;
  }
};

export const handleListLocation = (
  listCity,
  listDistrict,
  listWard,
  object
) => {
  if (object.city && object.cityCode) {
    if (object.district && object.districtCode) {
      return listWard.filter(item => item.districtCode === object.districtCode);
    } else {
      return listDistrict.filter(item => item.cityCode === object.cityCode);
    }
  } else {
    return listCity;
  }
};

export const checkValue = (object, excludeKeys = [], requireKeys = []) => {
  let hasValue = true;

  for (let key in object) {
    if (requireKeys && !requireKeys.includes(key)) {
      continue;
    }
    if (excludeKeys.includes(key)) {
      continue;
    }
    if (typeof object[key] === "object" && object[key] !== null) {
      if (!checkValue(object[key], excludeKeys, requireKeys)) {
        hasValue = false;
        break;
      }
    } else if (!object[key]) {
      hasValue = false;
      break;
    }
  }

  return hasValue;
};

