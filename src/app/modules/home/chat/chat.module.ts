import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatPageRoutingModule } from './chat-routing.module';

import { ChatPage } from './chat.page';
import { ChatBoxComponent } from '../components/chat-box/chat-box.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatPageRoutingModule,
    //ComponentsModule
  ],
  declarations: [ChatPage, ChatBoxComponent]
})
export class ChatPageModule {}
