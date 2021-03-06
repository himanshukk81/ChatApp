import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {Router} from '@angular/router';
import { ProductDetailPage } from '../../pages/product-detail/product-detail';
import { SessionService } from '../../app/sessionservice';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  products: FirebaseListObservable<any[]>;
  constructor(public service:SessionService,public db: AngularFireDatabase,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
    this.products = this.db.list('/products');
  }


  viewProduct(product)
  {
    this.service.setProduct(product);
    this.navCtrl.push(ProductDetailPage);
  }

}
