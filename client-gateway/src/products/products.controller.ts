import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto, RpcCustomExceptionFilter } from 'src/common';
import { CreateProductDto } from 'src/common/dto/create-product.dto';
import { UpdateProductDto } from 'src/common/dto/update-product.dto';
import { PRODUCT_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() CreateProductDto: CreateProductDto) {
    return this.productsClient.send({cmd: 'create_product'}, CreateProductDto )
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsClient.send({cmd: 'find_all_products'}, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const product = await firstValueFrom(this.productsClient.send({cmd: 'find_one_product'}, id))
      return product;
      
    } catch (error) {
      throw new RpcException(error);
    }
    
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
   return this.productsClient.send({cmd: 'remove_product'}, {id})
   .pipe(
    catchError(err => {throw new RpcException(err)})
   )
  }

  @Patch(':id')
  update(
    @Body() UpdateProductDto: UpdateProductDto, 
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productsClient.send({cmd:'update_product'},{
      id,
      ...UpdateProductDto
    }).pipe(
      catchError( err =>{throw new RpcException(err)})
    )
  }

}
