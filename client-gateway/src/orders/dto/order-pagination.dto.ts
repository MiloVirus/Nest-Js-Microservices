import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class OrderPaginationDto extends PaginationDto{

    @IsOptional()
    @IsEnum(OrderStatusList,
        {
            message: `valid status are ${OrderStatusList}`
        })
    status: OrderStatus;
}