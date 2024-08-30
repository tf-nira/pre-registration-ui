import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatKeyboardModule } from 'ngx7-material-keyboard-ios';

import { DemographicRoutingModule } from './demographic-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemographicComponent } from './demographic/demographic.component';

import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';
/**
 * @description This is the feature module for the demographic module.
 * @author Shashank Agrawal
 *
 * @export
 * @class DemographicModule
 */
@NgModule({
  declarations: [DemographicComponent],
 
  imports: [CommonModule, DemographicRoutingModule, ReactiveFormsModule, SharedModule, MatKeyboardModule,MatDialogModule,MatCardModule]
})
export class DemographicModule {}
