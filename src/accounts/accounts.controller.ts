import { Body, Controller, Post } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  linkinAccount(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.linkinAccount(createAccountDto);
  }
}
