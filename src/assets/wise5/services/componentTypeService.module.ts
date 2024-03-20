import { NgModule } from '@angular/core';
import { ComponentServiceLookupService } from './componentServiceLookupService';
import { UserService } from '../../../app/services/user.service';
import { ComponentTypeService } from './componentTypeService';
import { ConfigService } from '../../../app/services/config.service';

@NgModule({
  providers: [ComponentServiceLookupService, ComponentTypeService, ConfigService, UserService]
})
export class ComponentTypeServiceModule {}
