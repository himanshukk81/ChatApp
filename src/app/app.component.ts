import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,AlertController,NavController,NavParams} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { FCM } from '@ionic-native/fcm';
import { SessionService } from './sessionservice';
import { LoginPage } from '../pages/Login/Login';
import { NativeStorage } from '@ionic-native/native-storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { profile } from '../pages/profile/profile';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Network } from '@ionic-native/network';
import { Flashlight } from '@ionic-native/flashlight';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {Http, Response,RequestOptions,Headers} from '@angular/http';
import { LocationTrackerProvider } from '../providers/location-tracker';
import { UsersPage } from '../pages/users/users';
import { UserDetailPage} from '../pages/user-detail/user-detail';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(NavController) navCtrl: NavController;


  rootPage: any=LoginPage;
  headers:any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public fcm:FCM,public service:SessionService,public native:NativeStorage,public sharing:SocialSharing,public alertCtrl:AlertController  
    ,public nativeStorage:NativeStorage,public locationAccuracy:LocationAccuracy,public network:Network,public flashlight: Flashlight,public localNotifications:LocalNotifications,public http:Http
    ,public locationTracker:LocationTrackerProvider
    ) {

    this.headers = new Headers({'Content-Type':'application/json'});  
    this.initializeApp();
    // this.enableLocation();  
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Share App',component:HomePage},
      { title: 'Profile',component:profile},
      {title:'Notification',component:HomePage},
      {title:'Users',component:UsersPage},
      {title:'Logout',component:HomePage},

    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      // alert("Platform is ready");
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkUserStatus();
      this.initPushNotification();
      this.checkNetwork();
      this.enableLocation();
    });
  }
   enableLocation()
    {
        // alert("Calling location");
        this.locationAccuracy.canRequest().then((canRequest: boolean) => {
          if(canRequest) {

                  // the accuracy option will be ignored by iOS
            this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
              data =>
              {
                // alert("data::"+data);
                // this.service.showToast2("enable success");

            


                setTimeout(()=>{

                    // this.service.showToast2("Getting location");  
                    // this.service.getCurrentLocation();
                    this.locationTracker.startTracking();
                },100)
               
              },
              error=>{

                this.service.showToast("Failed to get location");
                // this.service.showToast2("Please enable your location for map load");
                // alert("Error::"+error);
              })
          }

        });
    }

  checkNetwork()
    {

      // alert("checking Network");
      // watch network for a disconnect
      let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        // console.log('network was disconnected :-(');

        // alert("you are disconnect");
          
        // this.modal = this.modalCtrl.create(MyModalPage);
        // this.modal.present();

        var message="Your Are Offline";
        // this.service.showToast(message);
        
      });

      // stop disconnect watch
      // disconnectSubscription.unsubscribe();


      // watch network for a connection
      let connectSubscription = this.network.onConnect().subscribe(() => {
        // console.log('network connected!');


        // alert("you are connected");

        var message="Your Are Online";
        // this.service.showToast(message);
        // this.modalProperty.modalhide();

        // this.modal.dismiss();
        // this.enableLocation();
        // We just got a connection but we need to wait briefly
        // before we determine the connection type. Might need to wait.
        // prior to doing any api requests as well.
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            var message="You Got Wifi Connection"
            // this.service.showToast(message);
          }
        }, 3000);
      });

      // stop connect watch
      // connectSubscription.unsubscribe();   
    }   
  checkUserStatus()
  {
      
     this.native.getItem('userInfo')
        .then
        (

            
            data =>
            {
                // this.userData=data;

                if(data)
                {
                  this.rootPage=HomePage;
                  this.service.setUser(data);
                }
                else
                {
                  this.rootPage=LoginPage;
                }
                this.enableLocation();
                this.checkNetwork();
            },
            error =>{
              // alert("Errror="+error)
              let error2="Error="+error;
              // this.service.showToast("Error="+error2);
              this.rootPage=LoginPage;
            }  
        );
  }
   initPushNotification()
    {

      this.fcm.subscribeToTopic('Notification');

      this.fcm.getToken().then(token=>{
        // alert("token=="+token);  
        console.log("token=="+JSON.stringify(token));

        this.service.setToken(token);
      }).catch( (e) => {
          // alert("error"+e);
          // //alert(JSON.stringify(e));
          });

      this.fcm.onNotification().subscribe(data=>{
        this.service.setOtherUserInfo(data);
        if(data.wasTapped){
             this.navCtrl.push(UserDetailPage);
            // alert("recieved notification=="+JSON.stringify(data));
        } else {
             this.navCtrl.push(UserDetailPage);
          //  alert("received notification without tap=="+JSON.stringify(data))
        };
      })

      this.fcm.onTokenRefresh().subscribe(token=>{
         console.log("refresh token==="+JSON.stringify(token));
         this.service.setToken(token);
      })

      this.fcm.unsubscribeFromTopic('Notification');
    }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    // alert("pages::"+JSON.stringify(this.pages[1]));
    // alert("page::"+JSON.stringify(page));

    if(this.pages[1].title==page.title)
      {
        // alert("if::"+JSON.stringify(this.pages[1]));
         this.sharing.share().then(() => {
          // Sharing via email is possible

          // alert("Success");
        }).catch(() => {
          // alert("Eror");
          // Sharing via email is not possible
        });
      }
      else if(this.pages[5].title==page.title)
      {
        // this.nativeStorage.clear()

        this.presentConfirm();
        // this.service.setUser(null);
        // this.nativeStorage.clear();
        // this.nav.setRoot(LoginPage);
        // this.nav.popToRoot();
      }
      else if(this.pages[3].title==page.title)
      {
        this.flashlight.switchOn();
        this.sendNotification()
        setTimeout(() => {  
          //  alert("Calling in time out");
          // directionsDisplay = new google.maps.DirectionsRenderer();
          this.flashlight.switchOff();       
          },3000);
      }
      else 
      {
        // alert("else::"+JSON.stringify(this.pages[1]));
        this.nav.setRoot(page.component);
        this.nav.popToRoot();
      }
      
  }
    sendNotification()
      {
        var notifyUrl="http://klaspring.staging.wpengine.com/push_api.php?token="+this.service.getToken();     
          // var timer = setTimeout(() => {

            setTimeout(()=>{
              this.http.get(notifyUrl,{headers: this.headers})
            // .map(val => val.json())
              .subscribe(data => 
                {
                  // alert("Success::"+JSON.stringify(data));

                  this.flashlight.switchOn();

                  setTimeout(() => {  
                  //  alert("Calling in time out");
                  // directionsDisplay = new google.maps.DirectionsRenderer();
                    this.flashlight.switchOff();       
                  },3000);
                  console.log(JSON.stringify(data))
                })
                err =>
                {
                // alert("Error"+err);
                }
            },5000)
                 
          // }, 2000);
      }
    presentConfirm() {
        let alert = this.alertCtrl.create({
          title: 'LogOut',
          message: 'Are You Sure you want to Logout?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                // console.log('Cancel clicked');
              }
            },
            {
              text: 'Confirm',
              handler: () => {
                // console.log('Buy clicked');
                // this.native.clear()        
                  // .then(()=>{
                    this.service.setUser(null);
                    this.nativeStorage.clear();
                    this.nav.setRoot(LoginPage);
                    this.nav.popToRoot();
                  },
                    
                  // this.nav.setRoot(login);
              
            }
          ]
        })
      
        alert.present();
  }
}
