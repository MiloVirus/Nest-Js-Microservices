import { Controller, Get, Post, Body, Param, Inject, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ORDER_SERVICE } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { OrderPaginationDto } from './dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersClient.send('createOrder', createOrderDto);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersClient.send('findAllOrders', orderPaginationDto);
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ){
    try 
    {
      return this.ordersClient.send('findAllOrders',
        {
          ...paginationDto,
          status: statusDto.status,
    });
    }
    catch(error)
    {
      console.log(error)
    }
  }


  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
   
    try {
       const order = await firstValueFrom(this.ordersClient.send('findOneOrder', {id}))
       
       return order
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
