const isJson = (str: any): boolean | object => {
  try {
    const p = JSON.parse(str);

    return p && !!str ? p : false;
  } catch (e) {
    return false;
  }
};

const isNumber = (num: any): boolean => num !== null && !isNaN(num);

enum recordStatus {
  Ok = "Ok",
  Error = "Error",
}

interface IRecord {
  id?: string;
  data?: string;
}

interface ILineItem {
  score: number;
  record: IRecord;
  status: keyof typeof recordStatus;
}

const processLineItem = (str: string): ILineItem => {
  const [tScore, tRecord] = str.split(/\:(.*)/).map((item) => item.trim());

  const score = +tScore;
  const record = (isJson(tRecord) || {}) as IRecord;
  const status =
    !isNumber(score) || !record || !("id" in record)
      ? recordStatus.Error
      : recordStatus.Ok;

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
