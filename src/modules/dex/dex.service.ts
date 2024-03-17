import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AssetPairsEntity } from '../assets/entities/asset-pairs.entity';
import { LiquidityPoolEntity } from './entities/liquidity-pool.entity';
import { AccountLiquidityPoolEntity } from './entities/account-liquidity-pool.entity';
import { CreateLiquidityPoolExtrinsicDto } from './dto/create-liquidity-pool-extrinsic.dto';
import { ProvideLiquidityExtrinsicDto } from './dto/provide-liquidity-extrinsic.dto';
import { RedeemLiquidityExtrinsicDto } from './dto/redeem-liquidity-extrinsic.dto';
import { SwapExactInForOutExtrinsicDto } from './dto/swap-exact-in-for-out-extrinsic.dto';
import { SwapInForExactOutExtrinsicDto } from './dto/swap-in-for-exact-out-extrinsic.dto';
import { ExecuteExtrinsicsDto } from './dto/execute-extrinsics.dto';
import { ExecuteExtrinsicsStatusEntity } from './entities/execute-extrinsincs-status.entity';

@Injectable()
export class DexService {
  private wsProviderEndpoint = process.env.WS_PROVIDER;
  private wsProvider = new WsProvider(this.wsProviderEndpoint);
  private api = ApiPromise.create({ provider: this.wsProvider });

  public async getLiquidityPools(): Promise<LiquidityPoolEntity[]> {
    const api = await this.api;

    return new Promise<LiquidityPoolEntity[]>(async (resolve, reject) => {
      let liquidityPools: LiquidityPoolEntity[] = [];
      const liquidityPoolStorage = await api.query["dexModule"]["liquidityPoolStorage"].entries();

      if (liquidityPoolStorage.length > 0) {
        liquidityPoolStorage.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          let assetPairs: AssetPairsEntity = {
            assetX: jsonData.assetPairs.assetX,
            assetY: jsonData.assetPairs.assetY,
          }

          let assetXBalance = parseFloat(String(jsonData.assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let assetYBalance = parseFloat(String(jsonData.assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

          liquidityPools.push({
            assetPairs: assetPairs,
            assetXBalance: assetXBalance,
            assetYBalance: assetYBalance,
            lpToken: jsonData.lpToken
          });
        });
      }

      resolve(liquidityPools);
    });
  }

  public async getLiquidityPool(assetX: number, assetY: number): Promise<LiquidityPoolEntity> {
    const api = await this.api;

    return new Promise<LiquidityPoolEntity>(async (resolve, reject) => {
      let liquidityPool: LiquidityPoolEntity = new LiquidityPoolEntity();
      let data = {
        assetX: assetX,
        assetY: assetY
      }

      const liquidityPoolStorage = (await api.query["dexModule"]["liquidityPoolStorage"](data)).toHuman();
      let jsonData = JSON.parse(JSON.stringify(liquidityPoolStorage));

      let assetPairs: AssetPairsEntity = {
        assetX: jsonData.assetPairs.assetX,
        assetY: jsonData.assetPairs.assetY,
      }

      let assetXBalance = parseFloat(String(jsonData.assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let assetYBalance = parseFloat(String(jsonData.assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

      liquidityPool = {
        assetPairs: assetPairs,
        assetXBalance: assetXBalance,
        assetYBalance: assetYBalance,
        lpToken: jsonData.lpToken
      };

      resolve(liquidityPool);
    });
  }

  public async getAccountLiquidityPoolByAccount(keypair: string): Promise<AccountLiquidityPoolEntity[]> {
    const api = await this.api;

    return new Promise<AccountLiquidityPoolEntity[]>(async (resolve, reject) => {
      let accountLiquidityPools: AccountLiquidityPoolEntity[] = [];
      const liquidityPoolStorage = await api.query["dexModule"]["liquidityPoolStorage"].entries();

      if (liquidityPoolStorage.length > 0) {
        let assetPairs: AssetPairsEntity[] = []
        liquidityPoolStorage.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          assetPairs.push({
            assetX: jsonData.assetPairs.assetX,
            assetY: jsonData.assetPairs.assetY,
          })
        });

        if (assetPairs.length > 0) {
          for (let ap = 0; ap < assetPairs.length; ap++) {
            const accountLiquidityPoolStorage = (await api.query["dexModule"]["accountLiquidityPoolStorage"]([keypair, assetPairs[ap]])).toHuman();
            if (accountLiquidityPoolStorage != null) {
              let jsonData = JSON.parse(JSON.stringify(accountLiquidityPoolStorage));

              if (jsonData.length > 0) {
                for (let i = 0; i < jsonData.length; i++) {
                  let assetXBalance = parseFloat(String(jsonData[i].assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
                  let assetYBalance = parseFloat(String(jsonData[i].assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
                  let lpTokenBalance = parseFloat(String(jsonData[i].lpTokenBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
                  let priceRatio = parseFloat(String(jsonData[i].priceRatio).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

                  accountLiquidityPools.push({
                    index: jsonData[i].index,
                    accountId: jsonData[i].accountId,
                    assetPairs: jsonData[i].assetPairs,
                    assetXBalance: assetXBalance,
                    assetYBalance: assetYBalance,
                    lpToken: jsonData[i].lpToken,
                    lpTokenBalance: lpTokenBalance,
                    priceRatio: priceRatio,
                  });
                }
              }
            }
          }
        }
      }

      resolve(accountLiquidityPools);
    });
  }

  public async createLiquidityPoolExtrinsic(data: CreateLiquidityPoolExtrinsicDto): Promise<any> {
    const api = await this.api;

    const createLiquidityPoolExtrinsic = api.tx["dexModule"]["createLiquidityPool"](
      data.assetX,
      BigInt(data.assetXBalance * (10 ** parseInt(process.env.DECIMALS))),
      data.assetY,
      BigInt(data.assetYBalance * (10 ** parseInt(process.env.DECIMALS))),
    );

    return createLiquidityPoolExtrinsic;
  }

  public async provideLiquidityExtrinsic(data: ProvideLiquidityExtrinsicDto): Promise<any> {
    const api = await this.api;

    const provideLiquidityExtrinsic = api.tx["dexModule"]["provideLiquidity"](
      data.assetX,
      BigInt(data.assetXBalance * (10 ** parseInt(process.env.DECIMALS))),
      data.assetY,
      BigInt(data.assetYBalance * (10 ** parseInt(process.env.DECIMALS))),
    );

    return provideLiquidityExtrinsic;
  }

  public async redeemLiquidityExtrinsic(data: RedeemLiquidityExtrinsicDto): Promise<any> {
    const api = await this.api;

    const redeemLiquidityExtrinsic = api.tx["dexModule"]["redeemLiquidity"](
      data.assetX,
      data.assetY,
      data.lpToken,
    );

    return redeemLiquidityExtrinsic;
  }

  public async swapExactInForOutExtrinsic(data: SwapExactInForOutExtrinsicDto): Promise<any> {
    const api = await this.api;

    const swapExactInForOutExtrinsic = api.tx["dexModule"]["swapExactInForOut"](
      data.assetExactIn,
      BigInt(data.assetExactInBalance * (10 ** parseInt(process.env.DECIMALS))),
      data.assetMaxOut,
    );

    return swapExactInForOutExtrinsic;
  }

  public async swapInForExactOutExtrinsic(data: SwapInForExactOutExtrinsicDto): Promise<any> {
    const api = await this.api;

    const swapInForExactOutExtrinsic = api.tx["dexModule"]["swapInForExactOut"](
      data.assetExactOut,
      BigInt(data.assetExactOutBalance * (10 ** parseInt(process.env.DECIMALS))),
      data.assetMinIn,
    );

    return swapInForExactOutExtrinsic;
  }

  public async executeExtrinsics(extrinsics: ExecuteExtrinsicsDto): Promise<ExecuteExtrinsicsStatusEntity> {
    const api = await this.api;

    return new Promise<ExecuteExtrinsicsStatusEntity>((resolve, reject) => {
      const executeExtrinsic = api.tx(extrinsics.signedExtrincs);
      executeExtrinsic.send((result: any) => {
        if (result.isError) {
          let message: ExecuteExtrinsicsStatusEntity = {
            message: "Something's went wrong!",
            isError: true
          }
          resolve(message);
        }

        if (result.dispatchError) {
          if (result.dispatchError.isModule) {
            const decoded = api.registry.findMetaError(result.dispatchError.asModule);
            const { docs, name, section } = decoded;

            let message: ExecuteExtrinsicsStatusEntity = {
              message: "Dispatch Error: " + name,
              isError: true
            }
            resolve(message);
          }
        }

        if (result.status.isInBlock) {

        }

        if (result.status.isFinalized) {
          let message: ExecuteExtrinsicsStatusEntity = {
            message: "Execution Complete",
            isError: false
          }
          resolve(message);
        }
      })
    });
  }
}
