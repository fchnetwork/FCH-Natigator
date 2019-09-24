import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppUIModule } from '@app/app.ui.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NetworkSelectComponent } from './network-select/network-select.component';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
    AppUIModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent
  ],
  declarations: [NetworkSelectComponent, HeaderComponent]
})
export class HeaderModule { }
