import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessRequestsController } from './access-requests.controller';
import { MedicalAccessRequest } from './entities/medical-access-request.entity';
import { User } from '@/modules/config/users/entities/user.entity';
import { Profile } from '@/modules/config/profiles/entities/profile.entity';
import { HelpersService } from '@/helpers/helpers.service';

// Use Cases
import { AccessRequestCreateUseCase } from './use-cases/access-request-create.use-case';
import { AccessRequestApproveUseCase } from './use-cases/access-request-approve.use-case';
import { AccessRequestRejectUseCase } from './use-cases/access-request-reject.use-case';

// Services
import { AccessRequestFindAllService } from './services/access-request-find-all.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MedicalAccessRequest, User, Profile])],
  controllers: [AccessRequestsController],
  providers: [
    HelpersService,

    // Use Cases
    AccessRequestCreateUseCase,
    AccessRequestApproveUseCase,
    AccessRequestRejectUseCase,

    // Services
    AccessRequestFindAllService,
  ],
  exports: [],
})
export class AccessRequestsModule {}
