const isJson = (str) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

const isNumber = (num) => typeof num === "number";

export const status = Object.freeze({
  Ok: "Ok",
  Error: "Error",
});

export const processLineItem = (str) => {
  const [score, record] = str.split(/\:(.*)/).map((item, i) => {
    item = item.trim();

    return i === 0 ? parseInt(item) : item;
  });

  return {
    score,
    record,
    status: !isNumber(score) || !isJson(record) ? status.Error : status.Ok,
  };
};
