import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateProductDto {
    @IsString()
    public name: string;


    @IsNumber()
    @Type(() => Number)
    public price: number;

}
