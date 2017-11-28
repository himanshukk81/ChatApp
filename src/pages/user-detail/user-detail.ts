import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Content,TextInput } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import { SessionService } from '../../app/sessionservice';

/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-detail',
  templateUrl: 'user-detail.html',
})






export class UserDetailPage {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  messages: FirebaseListObservable<any[]>;
  messageInfo:any;
  loader:any;
  showEmojiPicker = false;
  user:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public db:AngularFireDatabase,public service:SessionService) {
    this.messageInfo={};
    
  }


  
  ionViewDidLoad() {

    //  this.user=this.service.getUser(); 
     this.messages=this.db.list('/messages');
     this.scrollToBottom();
     this.messageInfo.createTime=new Date();

    //  var email=data.email.toLowerCase();
     
    //      email=email.replace(/\s/g, ""); 
     var senderEmail=this.service.getUser().email;
     var receiverEmail=this.service.getOtherUserInfo().email;

    //  senderEmail.replace
     this.messageInfo.senderEmail=senderEmail;
     this.messageInfo.receiverEmail=receiverEmail;
     this.messageInfo.email=senderEmail; 

      // this.messages=this.db.list('/messages',{
      //   query:{
      //     orderByChild:'receiverEmail',
      //     equalTo:this.service.getOtherUserInfo().email,
      //   },
      // })

    // this.messages=this.db.list('/messages');
    // console.log('ionViewDidLoad UserDetailPage');
  }

  onFocus() {
    this.showEmojiPicker = false;
    this.content.resize();
    this.scrollToBottom();
  }


  isYou(message) {
    // if(email == this.service.getUser().email)
    //   return false;
    // else
    //   return true;

    if(message.receiverEmail==this.service.getUser().email)
    {

      if(message.senderEmail==this.service.getOtherUserInfo().email)
      {
        return true;
      }
       
    }
  }
  isMe(message) {
    // if(email == this.service.getUser().email)
    // return true
    // else
    //  return false;
    if(message.senderEmail==this.service.getUser().email)
    {
      if(this.service.getOtherUserInfo().email==message.receiverEmail)
      {
        return true;
      }
    }  

      // return true;
    // else
    //   return false;
  }


  showMessage(message)
  {
    if(message.senderEmail==this.service.getUser().email)
    {
      if(this.service.getOtherUserInfo().email==message.receiverEmail)
      {
        return true;
      }
      
    }
    if(message.receiverEmail==this.service.getUser().email)
    {

      if(message.senderEmail==this.service.getOtherUserInfo().email)
      {
        return true;
      }
       
    }
  }





    switchEmojiPicker() {
        this.showEmojiPicker = !this.showEmojiPicker;
        if (!this.showEmojiPicker) {
            this.messageInput.setFocus();
        }
        this.content.resize();
        this.scrollToBottom();
    }
  scrollToBottom() {
    setTimeout(() => {
        if (this.content.scrollToBottom) {
            this.content.scrollToBottom();
        }
    }, 400)
}

  sendMessage()
  {

    // this.messageInfo.status="pending";
    this.loader=true;

    // this.messageInfo.pending=true;
    // this.messages.push(this.messageInfo);
    this.db.list('/messages').push(this.messageInfo).then(resolve => {
        console.log('all good');
        // this.messages.remove(this.messageInfo);
        // this.loader=false;
        // this.messageInfo.pending=false;
        this.scrollToBottom();
        // this.messageInfo.status="completed";
      }, reject => {
        console.log('error');
        this.loader=false;
        this.scrollToBottom();
        // this.messageInfo.status="failed";
      })

      this.messageInfo.editorMsg='';
      
  }



}
