import { InMemoryDbService } from 'angular-in-memory-web-api';

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateDataset() {
  let dataset = [];
  let numGroups = getRandomNumber(9, 16);
  for (let i = 0; i < numGroups; ++i) {
    let group = {
      group: i + 1,
      children: [],
      mean: getRandomNumber(150, 500),
      median: getRandomNumber(150, 500),
      mode: getRandomNumber(150, 500),
      range: getRandomNumber(150, 500)
    };
    let numChildren = getRandomNumber(50, 80);
    for (let j = 0; j < numChildren; ++j) {
      group.children.push({
        mean: getRandomNumber(0, 100),
        median: getRandomNumber(0, 100),
        mode: getRandomNumber(0, 100),
        range: getRandomNumber(0, 100)
      });
    }
    dataset.push(group);
  }
  return dataset;
}

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let dataset = generateDataset();
    return {dataset};
  }
}
