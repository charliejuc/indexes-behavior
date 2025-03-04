import { faker } from "@faker-js/faker";

const categoriesLength = 3;
const transactionsLength = 20;
const daysRange = 3;

const categoriesIds = Array.from({ length: categoriesLength }, () =>
  faker.string.uuid()
);
const sumDays = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);
  return newDate;
};
const generateTransaction = (options) => {
  const randomDate = () =>
    faker.date.between({
      from: sumDays(new Date(), daysRange * -1),
      to: new Date(),
    });

  return {
    id: faker.string.uuid(),
    amount:
      options?.amount ??
      Number(
        faker.finance.amount({
          min: 0,
          max: 3,
        })
      ),
    date: options?.date ?? randomDate(),
    visible: options?.visible ?? faker.datatype.boolean(),
    categoryId:
      options?.categoryId ?? faker.helpers.arrayElement(categoriesIds),
    updatedAt: options?.updatedAt ?? randomDate(),
    createdAt: options?.createdAt ?? randomDate(),
  };
};

const transactions = Array.from({ length: transactionsLength }, () =>
  generateTransaction({})
);

const parseValueByType = (value) => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return Math.floor(value);
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  return JSON.stringify(value);
};
const createIndex = (documents, fields, _index = {}) => {
  const index = _index ?? {};
  const field = fields[0];

  for (const document of documents) {
    const value = parseValueByType(document[field]);

    if (fields.length > 1) {
      index[value] = createIndex([document], fields.slice(1), index[value]);
      continue;
    }

    if (!index[value]) {
      index[value] = [];
    }

    index[value].push(document);
  }

  return index;
};

console.log(
  JSON.stringify(
    createIndex(transactions, ["categoryId", "amount", "date"]),
    null,
    2
  )
);
