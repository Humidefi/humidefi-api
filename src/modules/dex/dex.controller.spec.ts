import { Test, TestingModule } from '@nestjs/testing';
import { DexController } from './dex.controller';
import { DexService } from './dex.service';

describe('DexController', () => {
  let controller: DexController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DexController],
      providers: [DexService],
    }).compile();

    controller = module.get<DexController>(DexController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
