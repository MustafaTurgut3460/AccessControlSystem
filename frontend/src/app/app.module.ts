import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErisimNoktalariComponent } from './pages/erisim-noktalari/erisim-noktalari.component';
import { KartlarComponent } from './pages/kartlar/kartlar.component';
import { ErisimKayitlariComponent } from './pages/erisim-kayitlari/erisim-kayitlari.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IstatistiklerComponent } from './pages/istatistikler/istatistikler.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    ErisimNoktalariComponent,
    KartlarComponent,
    ErisimKayitlariComponent,
    IstatistiklerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
