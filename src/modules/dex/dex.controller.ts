import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { DexService } from './dex.service';
import { LiquidityPoolEntity } from './entities/liquidity-pool.entity';
import { AccountLiquidityPoolEntity } from './entities/account-liquidity-pool.entity';
import { CreateLiquidityPoolExtrinsicDto } from './dto/create-liquidity-pool-extrinsic.dto';
import { ProvideLiquidityExtrinsicDto } from './dto/provide-liquidity-extrinsic.dto';
import { RedeemLiquidityExtrinsicDto } from './dto/redeem-liquidity-extrinsic.dto';
import { SwapExactInForOutExtrinsicDto } from './dto/swap-exact-in-for-out-extrinsic.dto';
import { SwapInForExactOutExtrinsicDto } from './dto/swap-in-for-exact-out-extrinsic.dto';
import { ExecuteExtrinsicsDto } from './dto/execute-extrinsics.dto';
import { ExecuteExtrinsicsStatusEntity } from './entities/execute-extrinsincs-status.entity';

@Controller('api/dex')
@ApiTags('dex')
export class DexController {
  constructor(
    private readonly dexService: DexService
  ) { }

  @Get('/get/liquidity-pools')
  getLiquidityPools(): Promise<LiquidityPoolEntity[]> {
    return this.dexService.getLiquidityPools();
  }

  @Get('/get/liquidity-pool/:asset_x/:asset_y')
  getLiquidityPool(
    @Param('asset_x') asset_x: number,
    @Param('asset_y') asset_y: number
  ): Promise<LiquidityPoolEntity> {
    return this.dexService.getLiquidityPool(asset_x, asset_y);
  }

  @Get('/get/account-liquidity-pool-by-account/:keypair')
  getAccountLiquidityPoolByAccount(@Param('keypair') keypair: string): Promise<AccountLiquidityPoolEntity[]> {
    return this.dexService.getAccountLiquidityPoolByAccount(keypair);
  }

  @Post('/extrinsic/create-liquidity-pool')
  @ApiCreatedResponse({
    description: 'liquidity pool extrinsic created succesfully',
    type: CreateLiquidityPoolExtrinsicDto,
    isArray: false,
  })
  createLiquidityPoolExtrinsic(@Body() data: CreateLiquidityPoolExtrinsicDto): Promise<any> {
    return this.dexService.createLiquidityPoolExtrinsic(data);
  }

  @Post('/extrinsic/provide-liquidity')
  @ApiCreatedResponse({
    description: 'provided liquidity extrinsic created succesfully',
    type: ProvideLiquidityExtrinsicDto,
    isArray: false,
  })
  provideLiquidityExtrinsic(@Body() data: ProvideLiquidityExtrinsicDto): Promise<any> {
    return this.dexService.provideLiquidityExtrinsic(data);
  }

  @Post('/extrinsic/redeem-liquidity')
  @ApiCreatedResponse({
    description: 'redeem liquidity extrinsic created succesfully',
    type: RedeemLiquidityExtrinsicDto,
    isArray: false,
  })
  redeemLiquidityExtrinsic(@Body() data: RedeemLiquidityExtrinsicDto): Promise<any> {
    return this.dexService.redeemLiquidityExtrinsic(data);
  }

  @Post('/extrinsic/swap-exact-in-for-out')
  @ApiCreatedResponse({
    description: 'Swap exact in for out extrinsic created succesfully',
    type: SwapExactInForOutExtrinsicDto,
    isArray: false,
  })
  swapExactInForOutExtrinsic(@Body() data: SwapExactInForOutExtrinsicDto): Promise<any> {
    return this.dexService.swapExactInForOutExtrinsic(data);
  }

  @Post('/extrinsic/swap-in-for-exact-out')
  @ApiCreatedResponse({
    description: 'Swap in for exact out extrinsic created succesfully',
    type: SwapExactInForOutExtrinsicDto,
    isArray: false,
  })
  swapInForExactOutExtrinsic(@Body() data: SwapInForExactOutExtrinsicDto): Promise<any> {
    return this.dexService.swapInForExactOutExtrinsic(data);
  }

  @Post('/extrinsics/execute')
  @ApiCreatedResponse({
    description: 'Dex extrinsics executed succesfully',
    type: ExecuteExtrinsicsStatusEntity,
    isArray: false,
  })
  executeExtrinsics(@Body() data: ExecuteExtrinsicsDto): Promise<ExecuteExtrinsicsStatusEntity> {
    return this.dexService.executeExtrinsics(data);
  }
}
