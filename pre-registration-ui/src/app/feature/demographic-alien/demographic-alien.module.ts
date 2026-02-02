import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatKeyboardModule } from 'ngx7-material-keyboard-ios';

import { DemographicAlienRoutingModule } from './demographic-alien-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { DemographicAlienComponent } from './demographic-alien/demographic-alien.component';

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
  declarations: [DemographicAlienComponent],
 
  imports: [CommonModule, DemographicAlienRoutingModule, ReactiveFormsModule, SharedModule, MatKeyboardModule,MatDialogModule,MatCardModule]
})
export class DemographicAlienModule {}
