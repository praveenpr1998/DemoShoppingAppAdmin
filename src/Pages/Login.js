import React, { Component } from 'react';
import "../styles.css";
import "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner,Container} from "react-bootstrap"
import Background from '../Resources/Images/markus-winkler-HeqXGxnsnX4-unsplash.jpg';
const GLOBAL = require('../global');

class Login extends Component{
    
    state={
        email:"",
        emailError:"",
        password:'',
        isLoading:''
    }

    onChange(e){
        this.setState({ 
          [e.target.name]: e.target.value,
          secretKeyError: ''
        },()=>{
            this.validate();
        });
    };
    
    validate = () => {
        let isError = false;
        if(this.state.email==='' || this.state.password==='') {
            isError = true;
            this.setState({
                emailError:"Credentials cannot be empty"
            });
        }
        else{
            this.setState({emailError:''})
        } 
        return isError;
    };
      
    componentDidMount(){
        localStorage.removeItem("token")
    }

    handleLogin(e){
        
        const checkValidity=this.validate();

        if (!checkValidity) {
            this.setState({isLoading:true});
            fetch(GLOBAL.BASE_URL+"admin/adminLogin/",{
                method:"POST",
                body:JSON.stringify({email:this.state.email,password:this.state.password}),
            })
            .then(res => res.json())
            .then(
              (result) => {
                if (result.status) {    
                    this.setState({isLoading:false})
                    JSON.stringify(localStorage.setItem("token",result.token));
                    this.props.history.push("/recentorders")
                }
                else {
                    this.setState({
                        isLoading: false,
                        emailError: 'Invalid Email and password'
                    });
                }
            });
        }
    }

    render() {
   
      return(
        <Container className="bootstrapcontainer"> 
            <div className="mainpage">
                <img src={require("../Resources/Images/Harvest Logo.png")} class="logo" alt="Logo"></img>       
                {/* <p className="quote">Harvest App is a web application .....</p> */}
            </div>       
            <div className="logocontainer">
            <div style={{paddingBottom:20}}>
                <input 
                    type="email" 
                    autoFocus={true} 
                    name="email" 
                    onChange={e => this.onChange(e)} 
                    value={this.state.email} 
                    placeholder="Email *" />
                     <input 
                    type="password" 
                    name="password" 
                    onChange={e => this.onChange(e)} 
                    value={this.state.password} 
                    placeholder="Password *" />
                <div style={{color:"red"}}>{this.state.emailError}</div>
            </div>
            { this.state.isLoading ? 
                <div style={{paddingTop:10}}>
                    <Spinner animation="border" variant="success" />
                </div>:
                <button 
                    type="button" 
                    className="btn btn-sm"
                    style={{backgroundColor: GLOBAL.BASE_COLORS.MEDIUM_PEACH, color: '#FFF'}} 
                    onClick={(e)=>{this.handleLogin(e)}}>
                        Login
                </button>
            } 
            </div> 
            <div className="contact">
                <p className="quote">For any inquiries or questions regarding our store, products and prices, please contact us by email <a style={{"color":"#FBB165"}} href="mailto:harvestapp@thinkcodesoft.com">harvestapp@thinkcodesoft.com.</a></p>
            </div>
        </Container>
      )
  }
}

export default Login;
