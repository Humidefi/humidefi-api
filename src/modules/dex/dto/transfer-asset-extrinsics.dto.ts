import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TransferAssetExtrinsicDto {
    @ApiProperty({type: Number, description: 'This is a required property'})
    asset: number = 0;
    
    @ApiProperty({type: Number, description: 'This is an optional property'})
    assetBalance: number = 0;
    
    @ApiProperty({type: Number, description: 'This is a required property'})
    accountId: number = 0;
}