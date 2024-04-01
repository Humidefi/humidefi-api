import { AssetPairsEntity } from "src/modules/assets/entities/asset-pairs.entity";

export class AccountLiquidityPoolEntity {
    index: number = 0;
    accountId: number = 0;
    assetPairs: AssetPairsEntity = new AssetPairsEntity();
    assetXBalance: number = 0;
    assetYBalance: number = 0;
    lpToken: number = 0;
    lpTokenBalance: number = 0;
}
