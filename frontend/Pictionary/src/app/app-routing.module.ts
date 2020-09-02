import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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


const routes: Routes = [
  {path: '', component: PrijavaComponent},
  {path: 'accept_registration_request', component: RegistrationrequestsComponent},
  {path: 'accept_word_request', component: WordsrequestsComponent},
  {path: 'login', component: PrijavaComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'player', component: PlayerComponent},
  {path: 'game', component: GameComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'about', component: AboutComponent},
  {path: 'best_player', component: BestPlayerComponent},
  {path: 'delete_account', component: DeleteAccountComponent},
  {path: 'game/:room/:username', component: GameComponent},
  {path: 'chooseWord', component: ChooseWordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
