import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto, RpcCustomExceptionFilter } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}
s
  @Post()
  create() {
    return { message: 'Product created' };
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({cmd: 'find_all_products'}, paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      
      return this.productsClient.send({cmd: 'find_one_product'}, id);
    } catch (error) {
      return new RpcException(error);
    }
    
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return { message: `Product ${id} deleted` };
  }

  @Patch(':id')
  update(@Body() body, @Param('id') id: string) {
    return { message: `Product ${id} updated` };
  }

}
