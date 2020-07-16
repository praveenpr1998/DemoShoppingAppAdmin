import React from 'react';
import {BrowserRouter as Router,Route,Switch} from "react-router-dom";
import Login from "./Pages/Login.js";
import RecentOrders from "./Pages/RecentOrders";
import AllOrders from "./Pages/AllOrders";
import ManageProducts from "./Pages/ManageProducts";
import Coupons from "./Pages/Coupons";
import UserDetails from "./Pages/UsersDetails";

function App() {
  return (
    <div>
    <Router>
    <Switch>
    <Route exact path="/" component={Login}/>
    <Route exact path="/recentOrders" component={RecentOrders}/>
    <Route exact path="/allOrders" component={AllOrders}/>
    <Route exact path="/manageProducts" component={ManageProducts}/>
    <Route exact path="/coupons" component={Coupons}/>
    <Route exact path="/userDetails" component={UserDetails}/>
    <Route render={
      ()=>
        <div><h>404 Not Found </h></div>
    } />
    </Switch>
    </Router>
    </div>
  );
}

export default App;
