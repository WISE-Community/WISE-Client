import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppRoutingModule } from '../../app-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from './header.component';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';

const materialModules = [
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule
];

@NgModule({
  imports: [AppRoutingModule, CommonModule, FlexLayoutModule, HeaderComponent, materialModules],
  providers: [ConfigService, UserService],
  exports: [HeaderComponent]
})
export class HeaderModule {}
