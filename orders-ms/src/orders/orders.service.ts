import { HttpStatus, Injectable} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from 'src/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';
import { last } from 'rxjs';


@Injectable()
export class OrdersService  {
  
 constructor(private readonly prisma: PrismaService) {}
 
 async create(createOrderDto: CreateOrderDto) {
  try {
    return{createOrderDto: createOrderDto, service: 'Orders MS'}
  } catch (error) {
    throw new RpcException({
      status: HttpStatus.BAD_REQUEST,
      message: 'Failed to create order',
    });
  }
}

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalRecords = await this.prisma.order.count(
      {
        where: {status: orderPaginationDto.status}
      }
    )
    
    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.prisma.order.findMany({
        skip: (currentPage -1 ) * perPage,
        take: perPage,
        where:
        {
          status: orderPaginationDto.status
        }
      }),
      meta:
      {
        total: totalRecords,
        page: currentPage,
        lastPage: Math.ceil(totalRecords / perPage)
      }
    }
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      })
    }
    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const {id, status} = changeOrderStatusDto;
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    });
    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      })
    }

    return await this.prisma.order.update({
      where: {id},
      data: {status},
    });
  }

}
