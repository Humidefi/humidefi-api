import { Injectable } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { AssetPairsEntity } from '../assets/entities/asset-pairs.entity';
import { LiquidityPoolEntity } from './entities/liquidity-pool.entity';
import { AccountLiquidityPoolEntity } from './entities/account-liquidity-pool.entity';
import { NewLiquidityPoolExtrinsicDto } from './dto/new-liquidity-pool-extrinsic.dto';
import { RedeemLiquidityExtrinsicDto } from './dto/redeem-liquidity-extrinsic.dto';
import { SwapExactInForOutExtrinsicDto } from './dto/swap-exact-in-for-out-extrinsic.dto';
import { SwapInForExactOutExtrinsicDto } from './dto/swap-in-for-exact-out-extrinsic.dto';
import { TransferAssetExtrinsicDto } from './dto/transfer-asset-extrinsics.dto';
import { ExecuteExtrinsicsDto } from './dto/execute-extrinsics.dto';
import { ExecuteExtrinsicsStatusEntity } from './entities/execute-extrinsincs-status.entity';

@Injectable()
export class DexService {
  private wsProviderEndpoint = process.env.WS_PROVIDER;
  private wsProvider = new WsProvider(this.wsProviderEndpoint);
  private api = ApiPromise.create({ provider: this.wsProvider });

  public async createDexQuery(method: string, ...params: any[]): Promise<any> {
    const api = await this.api;

    let results: any = api.query["dexModule"][method].entries();
    if (params.length > 0) {
      results = (await api.query["dexModule"][method](...params)).toHuman();
    }

    return results;
  }

  public async createDexTransaction(method: string, ...params: any[]): Promise<any> {
    try {
      const api = await this.api;
      const extrinsic = api.tx["dexModule"][method](...params);

      return extrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async getLiquidityPools(): Promise<LiquidityPoolEntity[]> {
    let liquidityPools: LiquidityPoolEntity[] = [];

    let liquidityPoolQuery = await this.createDexQuery("liquidityPoolStorage");
    if (liquidityPoolQuery != null || liquidityPoolQuery != undefined) {
      if (liquidityPoolQuery.length > 0) {
        liquidityPoolQuery.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          let assetPairs: AssetPairsEntity = {
            assetX: jsonData.assetPairs.assetX,
            assetY: jsonData.assetPairs.assetY,
          }

          let assetXBalance = parseFloat(String(jsonData.assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let assetYBalance = parseFloat(String(jsonData.assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let price = parseFloat(String(jsonData.price).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let assetXFee = parseFloat(String(jsonData.assetXFee).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let assetYFee = parseFloat(String(jsonData.assetYFee).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
          let lpTokenBalance = parseFloat(String(jsonData.lpTokenBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

          liquidityPools.push({
            assetPairs: assetPairs,
            assetXBalance: assetXBalance,
            assetYBalance: assetYBalance,
            price: price,
            assetXFee: assetXFee,
            assetYFee: assetYFee,
            lpToken: jsonData.lpToken,
            lpTokenBalance: lpTokenBalance
          });
        });
      }
    }

    return liquidityPools;
  }

  public async getLiquidityPool(assetX: number, assetY: number): Promise<LiquidityPoolEntity> {
    let liquidityPool: LiquidityPoolEntity = new LiquidityPoolEntity();

    let data = { assetX: assetX, assetY: assetY }
    let liquidityPoolQuery = await this.createDexQuery("liquidityPoolStorage", data);
    if (liquidityPoolQuery != null || liquidityPoolQuery != undefined) {
      let jsonData = JSON.parse(JSON.stringify(liquidityPoolQuery));

      let assetPairs: AssetPairsEntity = {
        assetX: jsonData.assetPairs.assetX,
        assetY: jsonData.assetPairs.assetY,
      }
      let assetXBalance = parseFloat(String(jsonData.assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let assetYBalance = parseFloat(String(jsonData.assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let price = parseFloat(String(jsonData.price).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let assetXFee = parseFloat(String(jsonData.assetXFee).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let assetYFee = parseFloat(String(jsonData.assetYFee).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
      let lpTokenBalance = parseFloat(String(jsonData.lpTokenBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

      liquidityPool = {
        assetPairs: assetPairs,
        assetXBalance: assetXBalance,
        assetYBalance: assetYBalance,
        price: price,
        assetXFee: assetXFee,
        assetYFee: assetYFee,
        lpToken: jsonData.lpToken,
        lpTokenBalance: lpTokenBalance
      };
    }

    return liquidityPool;
  }

  public async getAccountLiquidityPoolByAccount(keypair: string): Promise<AccountLiquidityPoolEntity[]> {
    let accountLiquidityPools: AccountLiquidityPoolEntity[] = [];

    let liquidityPoolQuery = await this.createDexQuery("liquidityPoolStorage");
    if (liquidityPoolQuery != null || liquidityPoolQuery != undefined) {
      if (liquidityPoolQuery.length > 0) {
        let assetPairs: AssetPairsEntity[] = []
        liquidityPoolQuery.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          assetPairs.push({
            assetX: jsonData.assetPairs.assetX,
            assetY: jsonData.assetPairs.assetY,
          })
        });

        if (assetPairs.length > 0) {
          for (let ap = 0; ap < assetPairs.length; ap++) {
            let accountLiquidityPoolQuery = await this.createDexQuery("accountLiquidityPoolStorage", [keypair, assetPairs[ap]]);
            if (accountLiquidityPoolQuery != null || accountLiquidityPoolQuery != undefined) {
              let jsonData = JSON.parse(JSON.stringify(accountLiquidityPoolQuery));

              if (jsonData.length > 0) {
                for (let i = 0; i < jsonData.length; i++) {
                  let assetXBalance = parseFloat(String(jsonData[i].assetXBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
                  let assetYBalance = parseFloat(String(jsonData[i].assetYBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
                  let lpTokenBalance = parseFloat(String(jsonData[i].lpTokenBalance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));

                  accountLiquidityPools.push({
                    index: jsonData[i].index,
                    accountId: jsonData[i].accountId,
                    assetPairs: jsonData[i].assetPairs,
                    assetXBalance: assetXBalance,
                    assetYBalance: assetYBalance,
                    lpToken: jsonData[i].lpToken,
                    lpTokenBalance: lpTokenBalance,
                  });
                }
              }
            }
          }
        }
      }
    }

    return accountLiquidityPools;
  }

  public async newLiquidityPoolExtrinsic(data: NewLiquidityPoolExtrinsicDto): Promise<any> {
    try {
      let assetPairs = {
        assetX: data.assetX,
        assetY: data.assetY,
      }

      const newLiquidityExtrinsic = await this.createDexTransaction(
        "newLiquidity",
        assetPairs,
        BigInt(data.assetXBalance * (10 ** parseInt(process.env.DECIMALS))),
        BigInt(data.assetYBalance * (10 ** parseInt(process.env.DECIMALS))),
      );

      return newLiquidityExtrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async redeemLiquidityExtrinsic(data: RedeemLiquidityExtrinsicDto): Promise<any> {
    try {
      let assetPairs = {
        assetX: data.assetX,
        assetY: data.assetY,
      }

      const redeemLiquidityExtrinsic = await this.createDexTransaction(
        "redeemLiquidity",
        assetPairs,
        data.lpToken,
        data.id
      );

      return redeemLiquidityExtrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async swapExactInForOutExtrinsic(data: SwapExactInForOutExtrinsicDto): Promise<any> {
    try {
      const swapExactInForOutExtrinsic = await this.createDexTransaction(
        "swapExactInForOut",
        data.assetExactIn,
        BigInt(data.assetExactInBalance * (10 ** parseInt(process.env.DECIMALS))),
        data.assetMaxOut,
      );

      return swapExactInForOutExtrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async swapInForExactOutExtrinsic(data: SwapInForExactOutExtrinsicDto): Promise<any> {
    try {
      const swapInForExactOutExtrinsic = await this.createDexTransaction(
        "swapInForExactOut",
        data.assetExactOut,
        BigInt(data.assetExactOutBalance * (10 ** parseInt(process.env.DECIMALS))),
        data.assetMinIn,
      );

      return swapInForExactOutExtrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async transferAssetExtrinsic(data: TransferAssetExtrinsicDto): Promise<any> {
    try {
      const transferAssetExtrinsic = await this.createDexTransaction(
        "transferAsset",
        data.asset,
        BigInt(data.assetBalance * (10 ** parseInt(process.env.DECIMALS))),
        data.accountId,
      );

      return transferAssetExtrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async executeExtrinsics(extrinsics: ExecuteExtrinsicsDto): Promise<ExecuteExtrinsicsStatusEntity> {
    try {
      const api = await this.api;
      const executeExtrinsic = api.tx(extrinsics.signedExtrincs);

      const sendTransaction = await new Promise<ExecuteExtrinsicsStatusEntity>((resolve, reject) => {
        executeExtrinsic.send(async result => {
          let message: ExecuteExtrinsicsStatusEntity = {
            message: "",
            isError: true
          };

          if (result.isError) {
            message = {
              message: "Something went wrong!",
              isError: true
            };
            resolve(message);
          }

          if (result.dispatchError) {
            if (result.dispatchError.isModule) {
              const decoded = api.registry.findMetaError(result.dispatchError.asModule);
              const { docs, name, section } = decoded;

              message = {
                message: "Dispatch Error: " + name,
                isError: true
              };
              reject(message);
            }
          }

          if (result.status.isInBlock) { }

          if (result.status.isFinalized) {
            message = {
              message: "Execution Complete",
              isError: false
            };
            resolve(message);
          }
        }).catch(error => {
          reject(error);
        });
      });

      return sendTransaction;
    } catch (error) {
      throw error;
    }
  }
}
