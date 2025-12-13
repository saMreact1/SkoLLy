import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing-module';
import { Teacher } from './teacher';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
    Teacher
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatMenuTrigger
  ]
})
export class TeacherModule { }
