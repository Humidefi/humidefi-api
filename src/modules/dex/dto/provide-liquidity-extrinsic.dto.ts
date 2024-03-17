import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ProvideLiquidityExtrinsicDto {
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetX: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetXBalance: number = 0;

    @ApiProperty({type: Number, description: 'This is an optional property'})
    assetY: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetYBalance: number = 0;
}