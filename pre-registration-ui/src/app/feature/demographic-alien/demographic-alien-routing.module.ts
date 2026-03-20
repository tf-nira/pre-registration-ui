import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemographicAlienComponent } from './demographic-alien/demographic-alien.component';
import { CanDeactivateGuardService } from 'src/app/shared/can-deactivate-guard/can-deactivate-guard.service';

const routes: Routes = [{ path: '', component: DemographicAlienComponent, canDeactivate: [CanDeactivateGuardService] }];

/**
 * @description This module defines the route path for the demographic module.
 * @author Shashank Agrawal
 *
 * @export
 * @class DemographicAlienRoutingModule
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemographicAlienRoutingModule {}
