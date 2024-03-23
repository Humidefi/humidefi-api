import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { AssetEntity } from './entities/asset.entity';
import { TransferExtrinsicDto } from './dto/transfer-extrinsic.dto';
import { ExecuteExtrinsicsDto } from './dto/execute-extrinsics.dto';
import { ExecuteExtrinsicsStatusEntity } from './entities/execute-extrinsincs-status.entity';

@Controller('api/assets')
@ApiTags('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService
  ) { }

  @Get('/get/assets')
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAssets(): Promise<AssetEntity[]> {
    return await this.assetsService.getAssets();
  }

  @Get('/get/asset-balance-by-account/:asset_id/:keypair')
  @ApiResponse({ status: 200, description: '' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAssetBalanceByAccount(
    @Param('asset_id') asset_id: number,
    @Param('keypair') keypair: string
  ): Promise<number> {
    return await this.assetsService.getAssetBalanceByAccount(asset_id, keypair);
  }

  @Post('/extrinsic/transfer')
  @ApiResponse({ status: 200, description: 'The assets "transfer" extrinsic has been successfully generated.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async transferExtrinsic(@Body() data: TransferExtrinsicDto): Promise<any> {
    try {
      return await this.assetsService.transferExtrinsic(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('/extrinsics/execute')
  @ApiResponse({ status: 200, description: 'The assets extrinsic has been successfully executed.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async FexecuteExtrinsics(@Body() data: ExecuteExtrinsicsDto): Promise<ExecuteExtrinsicsStatusEntity> {
    try {
      return await this.assetsService.executeExtrinsics(data);
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.toString() || 'Internal server error',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
