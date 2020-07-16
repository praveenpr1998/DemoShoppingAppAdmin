import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner} from "react-bootstrap"
import AdminNavbar from "./AdminNavbar";
import { ToastContainer, toast } from 'react-toastify';
import { FcCalendar } from "react-icons/fc";
import DatePicker from "react-datepicker";
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact';
const GLOBAL = require('../global');

export default class Coupons extends Component{
    state={
        allCoupons:'',
        isLoading:true,
        editCouponCode:'',
        editdiscountPercentage:'',
        addCouponCode:'',
        adddiscountPercentage:'',
        modal:false,
        editId:'',
        addCouponModal:false,
        endDate: null,
    }

    componentDidMount(){
        fetch(GLOBAL.BASE_URL+"coupon/getCoupons/",{
            method:"POST",
            body:JSON.stringify({token:localStorage.getItem("token")}),
        })
        .then(res => res.json())
        .then(
          (result) => {
            if (result.status) {    
                this.setState({isLoading:false})
                this.setState({allCoupons:result.coupons});
            }
            else {
                this.setState({
                    isLoading: false,
                });
            }
        });
    }

    toggleModalEdit = (data) => {
        this.setState({
            modal: !this.state.modal,
            editCouponCode:data.couponCode,
            editdiscountPercentage:data.discountPercentage,
            editId:data.id,
            endDate:new Date(data.endDate)
        })
    }

    toggleModal = () => {
        this.setState({
            modal: !this.state.modal,
        })
    }

    toggleAddModal = () => {
        this.setState({
            addDiscountPercentage:'',
            endDate:null,
            addCouponModal: !this.state.addCouponModal,
        })
    }

    editCoupon(){
    if(this.state.editCouponCode === '' ||
    this.state.editdiscountPercentage === '' 
) {
    toast.error(' Please Fill All the details', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
} else if(isNaN(this.state.editdiscountPercentage)) {
    toast.error('Discount must be a Number', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
} else {
        fetch(GLOBAL.BASE_URL+'coupon/editCoupon', {
            method: 'PATCH',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id:this.state.editId,
                discountPercentage: this.state.editdiscountPercentage,
                couponCode: this.state.editCouponCode,
                endDate:this.state.endDate
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status) {
                        this.setState({
                            editCouponCode: '',
                            editdiscountPercentage: '',
                        });
                        this.toggleModal();
                        this.componentDidMount();
                    }
                    toast.success(' Coupon Details Updated', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                },
                function (error) {
                    toast.error('Error Editing Coupon! Please try again later', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            );
    }
};

// Delete Product Method
deleteCoupon = () => {
fetch(GLOBAL.BASE_URL+'coupon/deleteCoupon', {
    method: 'DELETE',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        id: this.state.editId,
    })
})
    .then(res => res.json())
    .then(
        (result) => {
            if(result.status) {
                this.toggleModal();
                this.componentDidMount();
            }
            toast.error(' Coupon Deleted', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        },
        (error) => {
            toast.error('Error Deleting Coupon! Please try again later', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    );
};

// Add Product Method
addCoupon = () => {
if(this.state.addCouponCode === '' ||
    this.state.adddiscountPercentage === '' 
) {
    toast.error(' Please Fill All the details', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
} else if(isNaN(this.state.adddiscountPercentage)) {
    toast.error('Discount percent must be a Number', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
}  else {
        fetch(GLOBAL.BASE_URL+'coupon/addCoupon', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                couponCode: this.state.addCouponCode,
                discountPercentage: this.state.adddiscountPercentage,
                endDate:this.state.endDate
                
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status){
                    this.setState({
                        addCouponCode: '',
                        addDiscountPercentage: '',
                    });
                        this.toggleAddModal();
                        this.componentDidMount();
                    toast.success('Product Added', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
                },
                (error) => {
                    toast.error('Error adding Product! Please try again later', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    this.setState({
                        addName: '',
                        addImage: '',
                        addCategory: '',
                        addDescription: '',
                        addPrice: '',
                        addPriceOthers: '',
                        addDiscountPercentage: 0,
                        addAvailability: 'in-stock',

                    });
                }
            );
    }
};


    render(){
        return(
            this.state.isLoading?<Spinner />: <div className='mp-primary-section'>
            <ToastContainer />
            <AdminNavbar />
            <center>
            <button
            className='add-product-btn'
            style={{padding: '5px 20px', marginTop: '20px', borderRadius: '8px'}}
            onClick={() => this.toggleAddModal()}>
                    Add Coupon
            </button>
            </center>
            <center>
            <div className='product-section'>
                            <table className='products-table'>
                        <tr>
                            <th >Coupon Code</th>
                            <th >Discount Percentage</th>
                            <th>End Date</th>
                            <th>Options</th>
                        </tr>
                        </table>
            </div>   
            </center>
                {this.state.allCoupons&&this.state.allCoupons.map((data)=>{
                    return(
                        <center>
                            <div className='product-section'>
                        <table className='products-table'>
                        <tr>
                            <td className='t-name-column'>{ data.couponCode }</td>
                            <td className='t-name-column'>{ data.discountPercentage }</td>
                            <td className='t-name-column'>{new Intl.DateTimeFormat('en-IN').format(data.endDate)}</td>
                            <td
                            className='t-options-column-edit'
                            onClick={() => this.toggleModalEdit(data)}>
                            Edit
                            </td>
                        </tr>
                    </table>
                    </div>
                    </center>
                    )
                })}

                    <MDBContainer>
                    <MDBModal isOpen={ this.state.modal } toggle={() => this.toggleModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleModal()}

                        >
                            <span className='modal-header-text'>Edit Product</span>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Coupon Code:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editCouponCode }
                                    placeholder='Product Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editCouponCode: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Discount Percentage:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editdiscountPercentage }
                                    placeholder='Discount Percentage'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editdiscountPercentage: event.target.value })}
                                />
                                  <div className='date-picker-start-section'>
                                <span className='date-picker-text'>
                                    End date:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select start date"
                                    selected={ this.state.endDate }
                                    onChange={ (date) => this.setState({ endDate: date }) }
                                    dateFormat="dd/MM/yyyy"
                                    minDate={ new Date() }
                                />
                            </div>
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.editCoupon()}
                                >
                                    Edit Product
                                </button>
                                <button
                                    className='modal-delete-btn'
                                    onClick={() => this.deleteCoupon()}
                                >
                                    Delete Coupon
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                <MDBContainer>
                    <MDBModal isOpen={ this.state.addCouponModal } toggle={() => this.toggleAddModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleAddModal()}
                            className='modal-header-text'
                        >
                            Add Product
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.addCouponCode }
                                    placeholder='Coupon Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ addCouponCode : event.target.value})}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>DiscountPercentage:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.adddiscountPercentage }
                                    placeholder='Discount Percenatage'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ adddiscountPercentage: event.target.value })}
                                />
                                 <div className='date-picker-start-section'>
                                <span className='date-picker-text'>
                                    End date:
                                </span>
                                <FcCalendar
                                    size="20"
                                    className='calender-icon'
                                />
                                <DatePicker
                                    className='date-picker-text-input'
                                    placeholderText="Select start date"
                                    selected={ this.state.endDate }
                                    onChange={ (date) => this.setState({ endDate: date }) }
                                    dateFormat="dd/MM/yyyy"
                                    minDate={ new Date() }
                                />
                            </div>
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.addCoupon()}
                                >
                                    Add Coupon
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
                
                    </div>
            
        )
    }
}