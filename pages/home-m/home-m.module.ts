import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMPage } from './home-m';

@NgModule({
  declarations: [
    HomeMPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMPage),
  ],
})
export class HomeMPageModule {}
