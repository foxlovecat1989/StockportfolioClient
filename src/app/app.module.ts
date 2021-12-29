import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { NotificationService } from './service/notification.service';
import { NotificationModule } from './notification.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WrapperComponent } from './wrapper/wrapper.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { TradeComponent } from './trade/trade.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TradeExecuteModalComponent } from './trade/trade-execute-modal/trade-execute-modal.component';
import { InventoryComponent } from './inventory/inventory.component';
import { StockComponent } from './stock/stock.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { WatchlistModalComponent } from './watchlist/watchlist-modal/watchlist-modal.component';
import { ConfirmModalComponent } from './watchlist/confirm-modal/confirm-modal.component';
import { AddStockToWatchlistModalComponent } from './stock/add-stock-to-watchlist-modal/add-stock-to-watchlist-modal.component';
import { AddUserModalComponent } from './admin/manage-user/add-user-modal/add-user-modal.component';
import { DeleteUserModalComponent } from './admin/manage-user/delete-user-modal/delete-user-modal.component';
import { ViewUserModalComponent } from './admin/manage-user/view-user-modal/view-user-modal.component';
import { UserdetailComponent } from './userdetail/userdetail.component';
import { ManageStockComponent } from './admin/manage-stock/manage-stock.component';
import { ViewStockModalComponent } from './admin/manage-stock/view-stock-modal/view-stock-modal.component';
import { AddStockModalComponent } from './admin/manage-stock/add-stock-modal/add-stock-modal.component';
import { ManageClassifyComponent } from './admin/manage-classify/manage-classify.component';
import { AddClassifyModalComponent } from './admin/manage-classify/add-classify-modal/add-classify-modal.component';
import { ViewClassifyModalComponent } from './admin/manage-classify/view-classify-modal/view-classify-modal.component';
import { DeleteClassifyModalComponent } from './admin/manage-classify/delete-classify-modal/delete-classify-modal.component';
import { UserLogoutComponent } from './user-logout/user-logout.component';
import { ResetPasswordComponent } from './rest-password/reset-password.component';
import { ChartsComponent } from './charts/charts.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    WrapperComponent,
    ManageUserComponent,
    TradeComponent,
    TradeExecuteModalComponent,
    InventoryComponent,
    StockComponent,
    WatchlistComponent,
    WatchlistModalComponent,
    ConfirmModalComponent,
    AddStockToWatchlistModalComponent,
    AddUserModalComponent,
    DeleteUserModalComponent,
    ViewUserModalComponent,
    UserdetailComponent,
    ManageStockComponent,
    ViewStockModalComponent,
    AddStockModalComponent,
    ManageClassifyComponent,
    AddClassifyModalComponent,
    ViewClassifyModalComponent,
    DeleteClassifyModalComponent,
    UserLogoutComponent,
    ResetPasswordComponent,
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NotificationModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    NgbModule,
    NgApexchartsModule
  ],
  entryComponents:[
    TradeExecuteModalComponent,
    WatchlistModalComponent,
    AddStockToWatchlistModalComponent,
    ViewUserModalComponent,
    AddUserModalComponent,
    DeleteUserModalComponent,
    AddStockModalComponent,
    ViewStockModalComponent,
    AddClassifyModalComponent,
    ViewClassifyModalComponent,
    ChartsComponent
  ],
  providers: [
    NotificationService,
    AuthenticationGuard,
    AuthenticationService,
    UserService,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
