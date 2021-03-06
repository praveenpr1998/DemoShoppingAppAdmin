import React, { Component } from 'react';
import '../Resources/Styling/AllOrders.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner, Container,Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AdminNavbar from "./AdminNavbar";
import { FcCalendar } from "react-icons/fc";
const GLOBAL = require('../global');

class AllOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            allOrdersEmpty: true,
            loading: true,
            startDate: null,
            endDate: new Date(),
            dateSelected:'no',
            filterVisible:'false',
            searchOrderId:'',
            searchedOrder:[]
        }
    }

    // Rendering Methods
    // Calculate Order Total
    orderTotal = (orderItem) => {
        let total = 0;
        orderItem.items.map(( cartItem) => {
            total += (cartItem['Quantity'] * cartItem['Price']);
            return null;
        });
        return total;
    };

    // Displayed data
    displayedData = () => {
        if(this.state.loading) {
            return(
                <Spinner animation="border" variant="success" />
            );
        }else if(this.state.searchedOrder&&this.state.searchedOrder.length!==0) {
            const orderItem=this.state.searchedOrder;
                    return(
                        <Container className="order-container" >
                             <div style={{display:'flex'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>{orderItem.userid}  -{orderItem.email} {(orderItem.phone!==null)?orderItem.phone:null} </div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>{ (orderItem.date) }</div>
                            </div>
                            <div style={{display:'flex', margin: '0 0.938em'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>Order_Id: {orderItem.orderid} {(orderItem.method!=='Cash On Delivery')?orderItem.paymentid:null} </div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>Coupon_Code: { orderItem.couponCode }</div>
                            </div>
                            <hr className='ro-hr' />
                            {
                                orderItem.items.map((cartItem) => {
                                    return(
                                        <li className='ro-items-list'>
                                            { cartItem['Name'] } - { cartItem['Quantity'] } - ₹{ cartItem['Price'] * cartItem['Quantity'] }
                                        </li>
                                    )
                                })
                            }
                            <hr className='ro-hr' />
                            <div className='order-total-text'>
                                Payment Mode:  {(orderItem.method)}
                                {(orderItem.wallet&&orderItem.wallet!==null)?<p>Wallet: {orderItem.wallet}</p>:null}
                                {(orderItem.wallet&&orderItem.bank!==null)?<p >Bank: {orderItem.bank}</p>:null}
                            </div>
                            <div className='order-total-text'>
                                Total: ₹ {this.orderTotal(orderItem)}
                            </div>
                            <div className='co-btn-div' >
                                <button
                                    className='mark-as-delivered-btn'
                                    onClick={() => this.markAsDelivered(orderItem)}>
                                        Mark as Delivered
                                </button>

                                <button
                                    className='reject-order-btn'
                                    onClick={() => this.rejectOrder(orderItem)}>
                                        Reject Order
                                </button>
                            </div>
                        </Container>
                    );
        } else if(!this.state.allOrdersEmpty) {
            return(
                this.state.order.map((orderItem, index) => {
                    return(
                        <Container
                            key={{index}}
                            className="order-container"
                        >
                            <div style={{display:'flex'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>{orderItem.userid}  -{orderItem.email} {(orderItem.phone!==null)?orderItem.phone:null} </div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>{ (orderItem.date) }</div>
                            </div>
                            <div style={{display:'flex', margin: '0 0.938em'}}>
                                <div style={{display:'flex', flex:1, fontWeight:'bold'}}>Order_Id: {orderItem.orderid} {(orderItem.method!=='Cash On Delivery')?orderItem.paymentid:null} </div>
                                <div style={{display:'flex', flex:1, justifyContent:'flex-end'}}>Coupon_Code: { orderItem.couponCode }</div>
                            </div>
                            <hr style={{backgroundColor: '#d4caca', marginTop: '0.5rem', marginBottom: '0.5rem'}} />
                            {
                                orderItem.items.map((cartItem) => {
                                    return(
                                        <li className='ao-items-list'>
                                            { cartItem['Name'] } - { cartItem['Quantity'] } - ₹{ cartItem['Price'] * cartItem['Quantity'] }
                                        </li>
                                    )
                                })
                            }
                            {/*<div style={{fontWeight:'bold', textAlign:'right', margin:'5px'}}>Total: ₹ {this.orderTotal(orderItem)}</div>*/}
                            <hr style={{backgroundColor: '#d4caca', marginTop: '0.5rem', marginBottom: '0.5rem'}} />
                            <div className='d-flex flex-row align-items-center justify-content-between'>
                                <span className='ao-order-status-text'>
                                    Order Status: { orderItem.orderStatus }
                                </span>
                                <span className='ao-order-total-text'>
                                    Total: ₹ {this.orderTotal(orderItem)}
                                </span>
                            </div>
                        </Container>
                    );
                })
            );
        } else if(this.state.allOrdersEmpty) {
            return(
                <div className='no-orders-msg'>
                    No Orders Available
                </div>
            )
        }
    };

    // Non-Rendering Methods
    // Filter Orders based on the date
    filterOrders(){
        toast.success('Orders Filtered', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
        this.componentDidMount();
    }

    // Component Life Cycle Methods
    componentDidMount() {
        fetch(GLOBAL.BASE_URL+'orders/getAllOrders',
            {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: localStorage.getItem('token'),
                    startDate:this.state.startDate,
                    endDate:this.state.endDate,
                    dateSelected:this.state.dateSelected
                })
            }
        )
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status === 200) {
                        if(result.allOrders.length === 0) {

                            this.setState({
                                allOrdersEmpty: true,
                                loading: false,
                                filterVisible:result.filterVisible
                            });
                        }
                         else {
                            this.setState({
                                allOrdersEmpty: false,
                                order: result.allOrders,
                                loading: false,
                                filterVisible:result.filterVisible
                            });
                        }
                    } else if(result.status === 401) {
                        alert('Invalid User, Please login again');
                        this.props.history.push("/");
                    }
                },
                (error) => {
                }
            );

    }

    searchOrder(){
        this.setState({loading:true})
        fetch(GLOBAL.BASE_URL+'orders/getOrderById', {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: this.state.searchOrderId
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result)
                    if(result.status) {
                        this.setState({searchedOrder:result.data,loading:false});
                    }})
    }

    // render() method
    render() {
        return(
            <div className='ao-primary-section'>
                <ToastContainer />
                <AdminNavbar />
                <div className='d-flex flex-column align-items-center justify-content-center'>
                    <span className='all-orders-text' style={{paddingTop:'20px'}}>
                        All Orders
                    </span>
                    {
                        (this.state.order.length!==0 || this.state.filterVisible===true)?
                        <div className='date-picker-section'>
                            <div className='date-picker-start-section'>
                                <span className='date-picker-text'>
                                    From:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select start date"
                                    selected={ this.state.startDate }
                                    onChange={ (date) => this.setState({ startDate: date, dateSelected: 'yes' }) }
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={ this.state.endDate - 1 }
                                />
                            </div>
                            <div className='date-picker-end-section'>
                                <span className='date-picker-text'>
                                    To:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select end date"
                                    dateFormat="dd/MM/yyyy"
                                    selected={ this.state.endDate }
                                    onChange={ (date) => this.setState({ endDate: date, dateSelected: 'yes' }) }
                                    minDate={ this.state.startDate }
                                    maxDate={ (new Date()) }
                                />
                            </div>
                            <div>
                                <Button
                                    className='filter-btn'
                                    onClick={ ()=>this.filterOrders() }
                                >
                                        Filter
                                </Button>
                            </div>
                            <div>
                                <input type="textbox"  placeholder="search order id" value={this.state.searchOrderId} onChange={(event)=>{this.setState({searchOrderId:event.target.value})}}></input>
                            </div>
                            <div>
                                <div
                                    className='filter-btn'
                                    onClick={ () => this.searchOrder() }
                                >
                                    Search Order
                                </div>
                            </div>
                        </div>:null
                    }

                    <hr className='all-orders-hr'/>
                    { this.displayedData() }
                    {/*<hr className='all-orders-bottom-hr'/>*/}
                </div>
            </div>
        );
    }
}

export default AllOrders;
