import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PpGraphComponent } from './pp-graph/pp-graph.component';
import { MappackClearComponent } from './mappack-clear/mappack-clear.component';

const routes: Routes = [
  {
    path: '',
    component: PpGraphComponent
  },
  {
    path: 'mappack-clear',
    component: MappackClearComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
