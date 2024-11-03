import { faker } from "@faker-js/faker";

// It is and example of the behavior of a simple database index to show the performance issues

const categoriesLength = 5;
const transactionsLength = 20;
const daysRange = 5;

const categoriesIds = Array.from({ length: categoriesLength }, () =>
  faker.string.uuid()
);
const sumDays = (date, offset) => {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + offset);
  return newDate;
};
const generateTransaction = () => {
  const randomDate = () =>
    faker.date.between({
      from: sumDays(new Date(), daysRange * -1),
      to: new Date(),
    });

  return {
    id: faker.string.uuid(),
    amount: Number(
      faker.finance.amount({
        min: 0,
        max: 5,
      })
    ),
    date: randomDate(),
    visible: faker.datatype.boolean(),
    categoryId: faker.helpers.arrayElement(categoriesIds),
    updatedAt: randomDate(),
    createdAt: randomDate(),
  };
};

const transactions = Array.from(
  { length: transactionsLength },
  generateTransaction
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
