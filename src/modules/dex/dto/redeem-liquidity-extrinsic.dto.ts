import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RedeemLiquidityExtrinsicDto {
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetX: number = 0;
    
    @ApiProperty({type: Number, description: 'This is an optional property'})
    assetY: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    lpToken: number = 0;

    @ApiProperty({type: Number, description: 'This is a required property'})
    id: number = 0;
}