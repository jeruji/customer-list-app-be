import { Controller, Get, Res, HttpStatus, Post, Body, Put, Query, UploadedFile, NotFoundException, Delete, Param, UseInterceptors } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDTO } from './dto/create-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { diskStorage } from 'multer';

@Controller('customer')
export class CustomerController {
    constructor(private customerService: CustomerService) {}

    @Post('/create')
    async addCustomer(@Res() res, @Body() createCustomerDTO: CreateCustomerDTO){
        const customer = await this.customerService.addCustomer(createCustomerDTO);
        return res.status(HttpStatus.OK).json({
            message: "Customer has been created successfully", customer
        })
    }

    @Get('customers')
    async getAllCustomer(@Res() res){
        const customers = await this.customerService.getAllCustomer();
        return res.status(HttpStatus.OK).json(customers);
    }

    @Get('customer/:customerID')
    async getCustomer(@Res() res, @Param('customerID') customerID){
        const customer = await this.customerService.getCustomer(customerID);
        if(!customer)
            throw new NotFoundException('Customer does not exist!');
        
        return res.status(HttpStatus.OK).json(customer);
    }

    @Put('/update')
    async updateCustomer(@Res() res, @Query('customerID') customerID, @Body() createCustomerDTO: CreateCustomerDTO){
        const customer = await this.customerService.updateCustomer(customerID, createCustomerDTO);
        if(!customer)
            throw new NotFoundException('Customer does not exist!');
        
        return res.status(HttpStatus.OK).json({
            message: 'Customer has been successfully updated', customer
        });    
    }

    @Delete('/delete')
    async deleteCustomer(@Res() res, @Query('customerID') customerID){
        const customer = await this.customerService.deleteCustomer(customerID);
        if(!customer) 
            throw new NotFoundException('Customer does not exist!');

        return res.status(HttpStatus.OK).json({
            message: 'Customer has been successfully deleted', customer
        }) ;   
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './files',
            filename: editFileName
        }),
        fileFilter: imageFileFilter
    }))
    async uploadFile(@UploadedFile() file){
        const response = {
            originalname: file.originalname,
            filename: file.filename
        }
        return response
    }
}
