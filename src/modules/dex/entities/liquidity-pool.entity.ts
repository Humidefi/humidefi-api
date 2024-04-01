import { AssetPairsEntity } from "src/modules/assets/entities/asset-pairs.entity";

export class LiquidityPoolEntity {
    assetPairs: AssetPairsEntity = new AssetPairsEntity();
    assetXBalance: number = 0;
    assetYBalance: number = 0;
    price: number = 0;
    assetXFee: number = 0;
    assetYFee: number = 0;
    lpToken: number = 0;
    lpTokenBalance: number = 0;
}
