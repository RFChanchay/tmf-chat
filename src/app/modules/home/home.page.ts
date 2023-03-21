import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
//import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, AlertController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Observable, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import {UserService} from'src/app/services/user/user.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Capacitor } from '@capacitor/core';

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
  selectedImage: any;


  constructor(
    private router:Router,
    private authService:AuthService,
    private chatService:ChatService,
    private userService:UserService,
    //private loadingController: LoadingController,
		//private alertController: AlertController,
    //private camera:Camera
    private camera: Camera,
    private actionSheetController: ActionSheetController
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
  
  /*async changeImage() {
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
	}*/

  changeImage(){}
  checkPlatformForWeb() {
    if(Capacitor.getPlatform() == 'web') return true; // isPlatform('web')
    return false;
  }

  // async takePicture() {
  //  // await Camera.requestPermissions();
  //   const image = await Camera.getPhoto({
  //     quality: 50,
  //     // allowEditing: true,
  //     source: CameraSource.Prompt,
  //     width: 600,
  //     resultType: this.checkPlatformForWeb() ? CameraResultType.DataUrl : CameraResultType.Uri
  //   });
  
  //   // image.webPath will contain a path that can be set as an image src.
  //   // You can access the original file using image.path, which can be
  //   // passed to the Filesystem API to read the raw data of the image,
  //   // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
  //   this.selectedImage = image;
  //   if(this.checkPlatformForWeb()) this.selectedImage.webPath = image.dataUrl;
  
  //   // Can be set to the src of an image now
  //   // imageElement.src = imageUrl;
  // }

  async takePicture() {
    // console.log('contact: ', contact);
    const actionSheet = await this.actionSheetController.create({
      header: 'Photo',
      // cssClass: 'my-custom-class',
      buttons: [{
        text: 'From Photos',
        handler: () => {
          console.log('gallary');
          this.takePhoto(0);
        }
      }, {
        text: 'Take Picture',
        handler: () => {
          console.log('camera');
          this.takePhoto(1);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    // const { data } = await actionSheet.onDidDismiss();
    // console.log('onDidDismiss', data);
  }

  async takePhoto(sourceType: number) {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: sourceType,
    };
    const image = await this.camera.getPicture(options);
    // this.selectedImage = 'data:image/jpeg;base64,' + image;
    
    // let filename = image.substring(image.lastIndexOf('/')+1);
    // let path =  image.substring(0,image.lastIndexOf('/')+1);
    // //then use it in the readAsDataURL method of cordova file plugin
    // //this.file is declared in constructor file :File
    // this.selectedImage = await this.file.readAsDataURL(path, filename);
    // // this.selectedImage = image;
    this.selectedImage = (<any>window).Ionic.WebView.convertFileSrc(image);
  }

}
