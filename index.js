import { faker } from "@faker-js/faker";

// It is and example of the behavior of a simple database index to show the performance issues

const categoriesIds = Array.from({ length: 20 }, () => faker.string.uuid());

const generateTransaction = () => {
  const randomDate = () =>
    faker.date.between({
      from: new Date("2021-01-01"),
      to: new Date(),
    });

  return {
    id: faker.string.uuid(),
    amount: Number(
      faker.finance.amount({
        min: 0,
        max: 10,
        dec: 0,
      })
    ),
    date: randomDate(),
    visible: faker.datatype.boolean(),
    categoryId: faker.helpers.arrayElement(categoriesIds),
    updatedAt: randomDate(),
    createdAt: randomDate(),
  };
};

const transactions = Array.from({ length: 30 }, generateTransaction);

const createIndex = (documents, fields, _index = {}) => {
  const index = _index ?? {};
  const field = fields[0];

  for (const document of documents) {
    const value = document[field];

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
  JSON.stringify(createIndex(transactions, ["categoryId", "amount"]), null, 2)
);
