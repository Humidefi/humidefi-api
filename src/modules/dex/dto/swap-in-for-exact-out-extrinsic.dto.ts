import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class SwapInForExactOutExtrinsicDto {
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetExactOut: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    assetExactOutBalance: number = 0;

    @ApiProperty({type: Number, description: 'This is an optional property'})
    assetMinIn: number = 0;
}