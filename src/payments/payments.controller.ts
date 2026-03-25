import { Controller, Get, Post, Body, Param, Delete, Patch, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly jwtService: JwtService,
  ) {}

  private extractUserIdFromAuthHeader(req: any): number | undefined {
    const authHeader = req?.headers?.authorization as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) return undefined;
    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = this.jwtService.decode(token) as { sub?: number } | null;
    if (!decoded?.sub) return undefined;
    return Number(decoded.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create a payment record' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: any) {
    const userId = this.extractUserIdFromAuthHeader(req);
    if (userId && !createPaymentDto.createdBy) {
      createPaymentDto.createdBy = userId;
    }
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment records' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific payment' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment record' })
  update(@Param('id') id: string, @Body() payload: Partial<CreatePaymentDto>, @Req() req: any) {
    const userId = this.extractUserIdFromAuthHeader(req);
    if (userId && !payload.createdBy) {
      payload.createdBy = userId;
    }
    return this.paymentsService.update(+id, payload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a payment record' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(+id);
  }
}
