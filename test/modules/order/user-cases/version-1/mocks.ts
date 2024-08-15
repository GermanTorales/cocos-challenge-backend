export const mockInstrumentRepository = {
  findOne: jest.fn(),
};

export const mockMarketRepository = {
  findOne: jest.fn(),
};

export const mockOrderRepository = {
  find: jest.fn(),
  create: jest.fn(),
};

jest.mock('../../../../../src/modules/financial-asset/repository/instrument.repository.ts', () => mockInstrumentRepository);
jest.mock('../../../../../src/modules/market/repository/market.repository.ts', () => mockMarketRepository);
jest.mock('../../../../../src/modules/order/repository/order.repository.ts', () => mockOrderRepository);
