import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SwapExactInForOutExtrinsicDto {
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetExactIn: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetExactInBalance: number = 0;

    @ApiProperty({type: Number, description: 'This is an optional property'})
    assetMaxOut: number = 0;
}