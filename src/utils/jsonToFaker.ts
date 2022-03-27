import faker from '@faker-js/faker';

const jsonToFaker = (data: object) => {
  let newData = { ...data };

  Object.entries(newData).forEach((arr) => {
    const [key, value] = arr;

    const obj = {
      [key]: faker.fake(`{{${value}}}`),
    };

    newData = { ...newData, ...obj };
  });

  return newData;
};

export default jsonToFaker;
