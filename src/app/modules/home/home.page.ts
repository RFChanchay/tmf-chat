import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('new_chat') modal!: ModalController;
  @ViewChild('popover') popover: PopoverController;
  segment='chats';
  open_new_chat = false;
  users=[
    {id:1,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'},
    {id:2,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'}
  
  ];

  chatRooms=[
    {id:1,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'},
    {id:2,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'}
  
  ];

  constructor(
    private router:Router,
    private authService:AuthService
  ) { }

  ngOnInit() {
  }
  onSegmentChanged(event:any){
    console.log(event);
  }
  async logout(){
    await this.authService.logout();
    this.popover.dismiss();
    this.router.navigateByUrl('/login');
  }
  newChat(){
    this.open_new_chat = true;
  }
  onWillDismiss(event: any) {}
  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }
  startChat(event){

  }
  getChat(item){
    this.router.navigate(['/','home','chat',item?.id]);
  }
}
