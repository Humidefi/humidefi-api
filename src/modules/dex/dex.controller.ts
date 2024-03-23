import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getLiquidityPools(): Promise<LiquidityPoolEntity[]> {
    return await this.dexService.getLiquidityPools();
  }

  @Get('/get/liquidity-pool/:asset_x/:asset_y')
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getLiquidityPool(
    @Param('asset_x') asset_x: number,
    @Param('asset_y') asset_y: number
  ): Promise<LiquidityPoolEntity> {
    return await this.dexService.getLiquidityPool(asset_x, asset_y);
  }

  @Get('/get/account-liquidity-pool-by-account/:keypair')
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAccountLiquidityPoolByAccount(@Param('keypair') keypair: string): Promise<AccountLiquidityPoolEntity[]> {
    return await this.dexService.getAccountLiquidityPoolByAccount(keypair);
  }

  @Post('/extrinsic/create-liquidity-pool')
  @ApiResponse({ status: 200, description: 'The dex "createLiquidityPool" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async createLiquidityPoolExtrinsic(@Body() data: CreateLiquidityPoolExtrinsicDto): Promise<any> {
    try {
      return await this.dexService.createLiquidityPoolExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsic/provide-liquidity')
  @ApiResponse({ status: 200, description: 'The dex "provideLiquidity" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async provideLiquidityExtrinsic(@Body() data: ProvideLiquidityExtrinsicDto): Promise<any> {
    try {
      return await this.dexService.provideLiquidityExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsic/redeem-liquidity')
  @ApiResponse({ status: 200, description: 'The dex "redeemLiquidity" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async redeemLiquidityExtrinsic(@Body() data: RedeemLiquidityExtrinsicDto): Promise<any> {
    try {
      return await this.dexService.redeemLiquidityExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsic/swap-exact-in-for-out')
  @ApiResponse({ status: 200, description: 'The dex "swapExactInForOut" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async swapExactInForOutExtrinsic(@Body() data: SwapExactInForOutExtrinsicDto): Promise<any> {
    try {
      return await this.dexService.swapExactInForOutExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsic/swap-in-for-exact-out')
  @ApiResponse({ status: 200, description: 'The dex "swapInForExactOut" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async swapInForExactOutExtrinsic(@Body() data: SwapInForExactOutExtrinsicDto): Promise<any> {
    try {
      return await this.dexService.swapInForExactOutExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsics/execute')
  @ApiResponse({ status: 200, description: 'The dex extrinsic has been successfully executed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async executeExtrinsics(@Body() data: ExecuteExtrinsicsDto): Promise<ExecuteExtrinsicsStatusEntity> {
    try {
      return await this.dexService.executeExtrinsics(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
