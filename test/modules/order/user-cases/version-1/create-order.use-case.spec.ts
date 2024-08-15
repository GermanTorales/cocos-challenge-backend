import { Test, TestingModule } from '@nestjs/testing';

import { PORTS } from '@common/enums';
import { IOrderRepository } from '@order/repository';
import { IMarketRepository } from '@market/repository';
import { CreateOrderDto } from '@order/dtos/version-1';
import { CreateOrder } from '@order/use-cases/version-1';
import { instrument, marketData, userOrders } from './data.mock';
import { IInstrumentRepository } from '@financial-asset/repository';
import { EOrderSides, EOrderStatuses, EOrderTypes } from '@order/entity';
import { InstrumentNotFound, OrderRejected } from '@/modules/order/exceptions';
import { mockInstrumentRepository, mockMarketRepository, mockOrderRepository } from './mocks';

describe('Create Order Use Case', () => {
  let orderRepository: IOrderRepository;
  let instrumentRepository: IInstrumentRepository;
  let marketRepository: IMarketRepository;
  let createOrderUseCase: CreateOrder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateOrder,
        { provide: PORTS.Instrument, useValue: mockInstrumentRepository },
        { provide: PORTS.Market, useValue: mockMarketRepository },
        { provide: PORTS.Order, useValue: mockOrderRepository },
      ],
    }).compile();

    createOrderUseCase = module.get<CreateOrder>(CreateOrder);
    instrumentRepository = module.get<IInstrumentRepository>(PORTS.Instrument);
    marketRepository = module.get<IMarketRepository>(PORTS.Market);
    orderRepository = module.get<IOrderRepository>(PORTS.Order);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error when the instrument not found', async () => {
    mockInstrumentRepository.findOne.mockResolvedValueOnce(null);

    const dto: CreateOrderDto = {
      ticker: 'XYZ',
      userid: 1,
      side: EOrderSides.BUY,
      quantity: 10,
      type: EOrderTypes.MARKET,
      price: 100,
    };

    await expect(createOrderUseCase.exec(dto)).rejects.toThrow(InstrumentNotFound);
  });

  it('should create an order type market successfully', async () => {
    const createOrderDto: CreateOrderDto = {
      userid: 1,
      side: EOrderSides.BUY,
      type: EOrderTypes.MARKET,
      quantity: 10,
      ticker: 'PAMP',
      price: 100,
    };

    mockInstrumentRepository.findOne.mockReturnValue(instrument);
    mockMarketRepository.findOne.mockReturnValue(marketData);
    mockOrderRepository.find.mockReturnValue(userOrders);
    mockOrderRepository.create.mockReturnValue(
      Promise.resolve({
        ...createOrderDto,
        status: EOrderStatuses.FILLED,
        id: Math.floor(Math.random() * 100),
        instrument: instrument.id,
      }),
    );

    const order = await createOrderUseCase.exec(createOrderDto);

    expect(marketRepository.findOne).toHaveBeenCalledWith({ id: instrument.id });
    expect(instrumentRepository.findOne).toHaveBeenCalledWith({ ticker: createOrderDto.ticker });
    expect(orderRepository.find).toHaveBeenCalledWith({ userid: createOrderDto.userid, status: EOrderStatuses.FILLED });

    expect(order).toMatchObject({
      id: expect.any(Number),
      instrument: instrument.id,
      userid: createOrderDto.userid,
      ticker: createOrderDto.ticker,
      status: EOrderStatuses.FILLED,
      type: createOrderDto.type,
      side: createOrderDto.side,
      quantity: expect.any(Number),
    });
  });

  it('should create an order type limit successfully', async () => {
    const createOrderDto: CreateOrderDto = {
      userid: 1,
      side: EOrderSides.BUY,
      type: EOrderTypes.LIMIT,
      quantity: 10,
      ticker: 'PAMP',
      price: 100,
      totalInvestment: 5000,
    };

    mockInstrumentRepository.findOne.mockReturnValue(instrument);
    mockMarketRepository.findOne.mockReturnValue(marketData);
    mockOrderRepository.find.mockReturnValue(userOrders);
    mockOrderRepository.create.mockReturnValue(
      Promise.resolve({
        ...createOrderDto,
        status: EOrderStatuses.NEW,
        id: Math.floor(Math.random() * 100),
        instrument: instrument.id,
      }),
    );

    const order = await createOrderUseCase.exec(createOrderDto);

    expect(marketRepository.findOne).toHaveBeenCalledWith({ id: instrument.id });
    expect(instrumentRepository.findOne).toHaveBeenCalledWith({ ticker: createOrderDto.ticker });
    expect(orderRepository.find).toHaveBeenCalledWith({ userid: createOrderDto.userid, status: EOrderStatuses.FILLED });

    expect(order).toMatchObject({
      id: expect.any(Number),
      instrument: instrument.id,
      userid: createOrderDto.userid,
      ticker: createOrderDto.ticker,
      status: EOrderStatuses.NEW,
      type: createOrderDto.type,
      side: createOrderDto.side,
      quantity: expect.any(Number),
    });
  });

  it('should an rejected order with insuficient cash available', async () => {
    const createOrderDto: CreateOrderDto = {
      userid: 1,
      side: EOrderSides.BUY,
      type: EOrderTypes.MARKET,
      quantity: 9999,
      ticker: 'PAMP',
      price: 100,
    };

    mockInstrumentRepository.findOne.mockReturnValue(instrument);
    mockMarketRepository.findOne.mockReturnValue(marketData);
    mockOrderRepository.find.mockReturnValue(userOrders);
    mockOrderRepository.create.mockReturnValue(Promise.resolve({ ...createOrderDto, status: EOrderStatuses.FILLED }));

    await expect(createOrderUseCase.exec(createOrderDto)).rejects.toThrow(OrderRejected);
  });
});
