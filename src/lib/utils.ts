const isJson = (str: any): boolean => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

const isNumber = (num: any): boolean => num !== null && !isNaN(num);

enum recordStatus {
  Ok = "Ok",
  Error = "Error",
}

interface ILineItem {
  score: number;
  record: string;
  status: keyof typeof recordStatus;
}

const processLineItem = (str: string): ILineItem => {
  const [tScore, record] = str.split(/\:(.*)/).map((item) => item.trim());
  const score = +tScore;
  const status =
    !isNumber(score) || !isJson(record) ? recordStatus.Error : recordStatus.Ok;

  return {
    score,
    record,
    status,
  };
};

const log = (str: string) => {
  process.stdout.write(`${str}\n\n`);
};

const now = () => Number(Date.now());

exports.recordStatus = recordStatus;
exports.processLineItem = processLineItem;
exports.log = log;
exports.now = now;
