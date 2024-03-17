import { AssetPairsEntity } from "src/modules/assets/entities/asset-pairs.entity";

export class LiquidityPoolEntity {
    assetPairs: AssetPairsEntity = new AssetPairsEntity();
    assetXBalance: number = 0;
    assetYBalance: number = 0;
    lpToken: number = 0;
}
