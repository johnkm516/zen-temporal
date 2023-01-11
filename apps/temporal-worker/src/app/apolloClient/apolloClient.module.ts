import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '../config';
import { ApolloClientService } from './apolloClient.service';

@Global()
@Module({
    imports: [HttpModule, ConfigModule],
    providers: [ApolloClientService],
    exports: [ApolloClientService]
})
export class ApolloClientModule {}
