import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import {UserService} from'src/app/services/user/user.service';

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
  users : Observable<any[]>;
  chatRooms : Observable<any[]>;
  profile = null;


  /*users=[
    {id:1,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'},
    {id:2,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'}
  
  ];*/

  /*chatRooms=[
    {id:1,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'},
    {id:2,name:'Randy',photo:'https://firebasestorage.googleapis.com/v0/b/login-eventos-286fd.appspot.com/o/bad-bunny.jpeg?alt=media&token=42c8ff64-7858-4e55-bd71-e3958a8001b9'}
  
  ];*/

  constructor(
    private router:Router,
    private authService:AuthService,
    private chatService:ChatService,
    private userService:UserService,
    private loadingController: LoadingController,
		private alertController: AlertController
  ) { 
    this.userService.getUserProfile().subscribe((data) => {
			this.profile = data;
		});
  }

  ngOnInit() {
    this.getRooms();
  }

  getRooms(){
    this.chatService.getChatRooms();
    this.chatRooms=this.chatService.chatRoms;
    console.log('chatrooms',this.chatRooms);
  }

  onSegmentChanged(event:any){
    console.log(event);
    this.segment=event.detail.value;
  }
  async logout(){
    await this.authService.logout();
    this.popover.dismiss();
    this.router.navigateByUrl('/login');
  }
  newChat(){
    this.open_new_chat = true;
    if(!this.users) this.getUsers();
  }

  getUsers(){
    this.chatService.getUsers();
    this.users =this.chatService.users;
  }

  onWillDismiss(event: any) {}
  cancel() {
    this.modal.dismiss();
    this.open_new_chat = false;
  }
  async startChat(item){
    try{
      //this.global.showLoader();
      const room = await this.chatService.createChatRooms(item?.uid);
      console.log('room',room);
      this.cancel();
    
      const navData:NavigationExtras={
        queryParams:{
          name:item?.name
        }
      };
      this.router.navigate(['/','home','chat',room?.id],navData);
      //this.global.hideLoader();
    }catch(e){
      console.log(e);
      //this.global.hideLoader();
    }
  }
  getChat(item){
    (item?.user).pipe(
      take(1)
    ).subscribe(user_data=>{
      console.log('data: ',user_data);
      const navData:NavigationExtras={
        queryParams:{
          name:user_data?.name
        }
      };
      this.router.navigate(['/','home','chat',item?.id],navData);
    });
  }
  getUser(user:any){
    console.log('the user: ',user);
    return user;
  }
  
  async changeImage() {
		const image = await Camera.getPhoto({
			quality: 90,
			allowEditing: false,
			resultType: CameraResultType.Base64,
			source: CameraSource.Photos // Camera, Photos or Prompt!
		});

		if (image) {
			const loading = await this.loadingController.create();
			await loading.present();

			const result = await this.userService.uploadImage(image);
			loading.dismiss();

			if (!result) {
				const alert = await this.alertController.create({
					header: 'Upload failed',
					message: 'There was a problem uploading your avatar.',
					buttons: ['OK']
				});
				await alert.present();
			}
		}
	}
}
