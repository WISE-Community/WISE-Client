import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginHomeComponent } from './login-home/login-home.component';

const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    children: [{ path: '', component: LoginHomeComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(loginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
