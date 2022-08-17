import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErisimKayitlariComponent } from './pages/erisim-kayitlari/erisim-kayitlari.component';
import { ErisimNoktalariComponent } from './pages/erisim-noktalari/erisim-noktalari.component';
import { IstatistiklerComponent } from './pages/istatistikler/istatistikler.component';
import { KartlarComponent } from './pages/kartlar/kartlar.component';

const routes: Routes = [
  {path: '', component:DashboardComponent},
  {path: 'erisim-kayitlari', component:ErisimKayitlariComponent},
  {path: 'erisim-noktalari', component:ErisimNoktalariComponent},
  {path: 'kartlar', component:KartlarComponent},
  {path: 'erisim-noktalari/update/:id', component:ErisimNoktalariComponent},
  {path: 'kartlar/update/:id', component:KartlarComponent},
  {path: 'istatistikler', component:IstatistiklerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
