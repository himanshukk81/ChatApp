import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SessionService } from '../../app/sessionservice';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  orderInfo:any;
  constructor(public db:AngularFireDatabase,public service:SessionService,public navCtrl: NavController, public navParams: NavParams) {
    this.orderInfo=this.service.getOrderInfo();
  }

  ionViewDidLoad() {
    
    console.log('ionViewDidLoad OrderDetailPage');
  }

}
