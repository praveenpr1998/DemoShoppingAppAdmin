import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner,Container} from "react-bootstrap"
import AdminNavbar from "./AdminNavbar";
import '../Resources/Styling/RecentOrders.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MDBContainer, MDBModal, MDBModalBody, MDBModalHeader} from 'mdbreact';
import Background from '../Resources/Images/markus-winkler-HeqXGxnsnX4-unsplash.jpg';
const GLOBAL = require('../global');

export default class UserDetails extends Component{

    state={
        loader:false,
        editId:'',
        editUser:'',
        editUserEmail:'',
        editUserMboile:'',
        editUserName:'',
        emailModal:false
    }

    componentDidMount(){
        this.setState({loader:true});
        fetch(GLOBAL.BASE_URL+'users', {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({allUsers:result,loader:false});
        })
    }

    toggleModalEdit = (user) => {
        this.setState({
            editUserName:user.name,
            editUserEmail:user.email,
            editUserMboile:user.mobile,
            editId:user.userid,
            modal:!this.state.modal,
        })
    }

    toggleEmailModalEdit(user){
        this.setState({editUserEmail:user.email,emailModal:true})
    }

    displayUsers(){
        return(
            <div className='product-section'>
                <center>
                <table className='products-table'>
            <tr>
                <th >User Name</th>
                <th>User Phone</th>
                <th >User Email(₹)</th>
                <th>Edit User</th>
                <th>Options</th>
            </tr>
            {this.state.allUsers&&this.state.allUsers.length!==0?(
          this.state.allUsers.map((user)=>{
              return(
                <tr>
                    <td>{user.name}</td>
                    <td>{user.mobile}</td>
                     <td>{user.email}</td>
                     <td  onClick={() => this.toggleModalEdit(user)} >Edit</td>
                     <td onClick={() => this.toggleEmailModalEdit(user)}>Send Email</td> 
                </tr>
              )
          }) 
        ):null}
            </table>
            </center>
            </div>
        )
    }

    toggleMailModal(){
        this.setState({emailModal:!this.state.emailModal})
    }

    toggleModal(){
        this.setState({modal:!this.state.modal})
    }

    editUser(){
        if(this.state.editUserName === '' ||
            this.state.editUserEmail === '' ||
            this.state.editUserMboile === '' 
        ) {
            toast.error(' Please Fill All the details', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else if(isNaN(this.state.editUserMboile)||(this.state.editUserMboile.length<10)) {
            toast.error(' Enter a valid mobile Number', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
                fetch(GLOBAL.BASE_URL+'users/editUser', {
                    method: 'PATCH',
                    mode: 'cors',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        userid: this.state.editId,
                        name: this.state.editUserName,
                        email: this.state.editUserEmail,
                        mobile: this.state.editUserMboile
                    })
                })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result.status) {
                                this.setState({
                                    editUserEmail: '',
                                    editUserName: '',
                                    editUserMboile  : '',
                                    editId: ''
                                });
                                this.toggleModal();
                                this.componentDidMount();
                            }
                            toast.success(' User Details Updated', {
                                position: "top-right",
                                autoClose: 5000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                            });
                        },
                        function (error) {
                            toast.error('Error Editing User! Please try again later', {
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

        
    }

    deleteUser(){
        fetch(GLOBAL.BASE_URL+'users/deleteUser', {
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
                    toast.error(' User Deleted', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                },
                (error) => {
                    toast.error('Error Deleting User! Please try again later', {
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

    sendEmail(){
        fetch(GLOBAL.BASE_URL+'users/mailToUser', {
            method: 'POST',
            mode: 'cors',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.editUserEmail,
                mailDescription:this.state.editEmailDescription
            })
        })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result.status) {
                        this.toggleMailModal();
                        toast.error(' Email Sent', {
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
                    toast.error('Error Sending Email! Please try again later', {
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

    render(){
        return(
            <div className='primary-section'>
            <ToastContainer />
            <AdminNavbar />
            <div className='d-flex flex-column align-items-center justify-content-center'>
           {this.displayUsers()}
                </div>

                <MDBContainer>
                    <MDBModal isOpen={ this.state.modal } toggle={() => this.toggleModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleModal()}

                        >
                            <span className='modal-header-text'>Edit User</span>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>
                                <div className='field-section'>
                                    <span className='field-text'>User Name:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editUserName }
                                    placeholder='User Name'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editUserName: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>User Mobile:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editUserMboile }
                                    placeholder='User Mobile'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editUserMboile: event.target.value })}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>User Email:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editUserEmail }
                                    placeholder='User Mobile'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editUserEmail: event.target.value })}
                                />
        
                                <button
                                    className='modal-edit-btn'
                                    onClick={() => this.editUser()}
                                >
                                    Edit User
                                </button>
                                <button
                                    className='modal-delete-btn'
                                    onClick={() => this.deleteUser()}
                                >
                                    Delete User
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>

                
                <MDBContainer>
                    <MDBModal isOpen={ this.state.emailModal } toggle={() => this.toggleMailModal()}>
                        <MDBModalHeader
                            toggle={() =>this.toggleMailModal()}

                        >
                            <span className='modal-header-text'>Mail To User</span>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <div className='d-flex flex-column align-items-center justify-content-center'>                     
                                <div className='field-section'>
                                    <span className='field-text'>User Email:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editUserEmail }
                                    placeholder='User Mobile'
                                    className='modal-text-input'
                                    disabled={true}
                                />
                                <div className='field-section'>
                                    <span className='field-text'>Desciption:</span>
                                </div>
                                <input
                                    type='text'
                                    value={ this.state.editEmailDescription }
                                    placeholder='Email Description'
                                    className='modal-text-input'
                                    onChange={(event) => this.setState({ editEmailDescription: event.target.value })}
                                />
                                <button
                                    className='modal-delete-btn'
                                    onClick={() => this.sendEmail()}
                                >
                                    Send Email
                                </button>
                            </div>
                        </MDBModalBody>
                    </MDBModal>
                </MDBContainer>
            </div>
        )
    }
}