import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { PrijavaComponent } from './components/prijava/prijava.component';
import { AdminComponent } from './components/admin/admin.component';
import { PlayerComponent } from './components/player/player.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { RegistrationrequestsComponent } from './components/registrationrequests/registrationrequests.component';
import { GameComponent } from './components/game/game.component';
import { AboutComponent } from './components/about/about.component';
import { WordsrequestsComponent } from './components/wordsrequests/wordsrequests.component';
import { BestPlayerComponent } from './components/best-player/best-player.component';
import { DeleteAccountComponent } from './components/delete-account/delete-account.component';
import { ChooseWordComponent } from './components/choose-word/choose-word.component';

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    AdminComponent,
    PlayerComponent,
    RegistrationComponent,
    RegistrationrequestsComponent,
    GameComponent,
    AboutComponent,
    WordsrequestsComponent,
    BestPlayerComponent,
    DeleteAccountComponent,
    ChooseWordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
