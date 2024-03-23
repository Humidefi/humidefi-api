import { Injectable, Logger } from '@nestjs/common';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { stringToHex, stringToU8a, u8aToHex, u8aToString, hexToString, hexToBigInt } from '@polkadot/util';
import { AssetEntity } from './entities/asset.entity';
import { AssetMetadataEntity } from './entities/asset-metadata.entity';
import { TransferExtrinsicDto } from './dto/transfer-extrinsic.dto';
import { ExecuteExtrinsicsDto } from './dto/execute-extrinsics.dto';
import { ExecuteExtrinsicsStatusEntity } from './entities/execute-extrinsincs-status.entity';

@Injectable()
export class AssetsService {
  private wsProviderEndpoint = process.env.WS_PROVIDER;
  private wsProvider = new WsProvider(this.wsProviderEndpoint);
  private api = ApiPromise.create({ provider: this.wsProvider });

  public async createAssetsQuery(method: string, ...params: any[]): Promise<any> {
    const api = await this.api;

    let results: any = api.query["assets"][method].entries();
    if (params.length > 0) {
      results = (await api.query["assets"][method](...params)).toHuman();
    }

    return results;
  }

  public async createAssetsTransaction(method: string, ...params: any[]): Promise<any> {
    try {
      const api = await this.api;
      const extrinsic = api.tx["assets"][method](...params);

      return extrinsic;
    } catch (error) {
      throw error;
    }
  }

  public async getAssets(): Promise<AssetEntity[]> {
    let assets: AssetEntity[] = [];
    let assetMetadatas: AssetMetadataEntity[] = [];

    let metadataQuery = await this.createAssetsQuery("metadata");
    if (metadataQuery != null || metadataQuery != undefined) {
      if (metadataQuery.length > 0) {
        metadataQuery.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          assetMetadatas.push({
            asset_id: parseInt(id.toString()),
            deposit: jsonData.deposit,
            name: hexToString(jsonData.name),
            symbol: hexToString(jsonData.symbol),
            decimals: jsonData.decimals,
            isFrozen: jsonData.isFrozen,
          });
        });
      }
    }

    let assetQuery = await this.createAssetsQuery("asset");
    if (assetQuery != null || assetQuery != undefined) {
      if (assetQuery.length > 0) {
        assetQuery.forEach(([{ args: [id] }, data]) => {
          let jsonData = JSON.parse(data.toString());
          let metadatas = assetMetadatas.filter(d => d.asset_id == parseInt(id.toString()));

          assets.push({
            id: parseInt(id.toString()),
            accounts: jsonData.accounts,
            admin: jsonData.admin,
            approvals: jsonData.approvals,
            deposit: jsonData.deposit,
            freezer: jsonData.freezer,
            isSufficient: jsonData.isSufficient,
            issuer: jsonData.issuer,
            minBalance: jsonData.minBalance,
            owner: jsonData.owner,
            status: jsonData.status,
            sufficients: jsonData.sufficients,
            supply: jsonData.supply,
            metadata: metadatas[0]
          });
        });
      }
    }

    let listAssets = assets.filter(d => d.metadata != undefined);
    return listAssets
  }

  public async getAssetBalanceByAccount(asset_id: number, keypair: string): Promise<number> {
    let balance: number = 0;

    let accountQuery = await this.createAssetsQuery("account", asset_id, keypair);
    if (accountQuery != null || accountQuery != undefined) {
      balance = parseFloat(String(accountQuery.balance).split(',').join('')) / (10 ** parseInt(process.env.DECIMALS));
    }

    return balance;
  }

  public async transferExtrinsic(data: TransferExtrinsicDto): Promise<any> {
    try {
      const transferExtrinsic = await this.createAssetsTransaction(
        "transfer",
        data.id,
        data.target,
        BigInt(data.amount * (10 ** parseInt(process.env.DECIMALS))),
      );

      return transferExtrinsic;
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
