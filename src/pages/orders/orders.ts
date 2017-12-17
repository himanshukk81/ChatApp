import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { OrderDetailPage } from '../../pages/order-detail/order-detail';
import { SessionService } from '../../app/sessionservice';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';

/**
 * Generated class for the OrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-orders',
  templateUrl: 'orders.html',
})
export class OrdersPage {
  orders: FirebaseListObservable<any[]>;
  constructor(public service:SessionService,public db: AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersPage');
    this.orders = this.db.list('/orders');
  }

  orderDetail(order)
  {
    this.service.setOrderInfo(order);
    this.navCtrl.push(OrderDetailPage);
  }

}
