import { InMemoryDbService } from 'angular-in-memory-web-api';

function generateDataset() {
  let dataset = [];
  for (let i = 0; i < 2000; ++i) {
    dataset.push({
      mean: Math.random() * 100,
      median: Math.random() * 100,
      mode: Math.random() * 100,
      range: Math.random() * 100
    });
  }
  return dataset;
}

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    let dataset = generateDataset();
    return {dataset};
  }
}
