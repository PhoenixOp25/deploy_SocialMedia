import React, { useEffect ,useState} from 'react'
import logo from "./img/logo.png"
import "../css/SignUp.css"
import {Link,useNavigate} from "react-router-dom"
import {toast} from 'react-toastify'

function SignUp() {
    // const fetchData=async()=>{
    //     const response =await fetch("/")
    //     const data=await response.json()
    //     console.log(data)
    // }
    // useEffect(()=>{
    //     fetchData()
    // },[])
    const navigate=useNavigate();
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [userName,setuserName]=useState("");
    const [password,setPassword]=useState("");
    //toast fn
    const notifyA=(msg)=>toast.error(msg);
    const notifyB=(msg)=>toast.success(msg);

    const emailRegex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    const passRegex =/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    const postData= ()=> { 

        //check email
        if(!emailRegex.test(email)){
           notifyA("Invalid email")
           return;
        }
        else if(!passRegex.test(password)){
            notifyA("bro password must contain min8 char,with atleast 1 num,both lower and upper case,1 special char");
            return;
        }


        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name:name,
                userName:userName,
                email:email,
                password:password
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.error){
                notifyA(data.error);
            }
            else{
                notifyB(data.message);
                navigate("/signin")
            }
            console.log(data)})
    }

  return (
    <div className='signUp'>
        <div className='form-container'>
            <div className='form'>
            <img className='signUpLogo' src={logo} alt='' />
            <p className='loginPara'>
                SignUp to see Photo and vid <br/> from ur friends
                </p>
                <div>
                    <input type="email" name="email"
                     id='email' value={email} placeholder='Email' 
                     onChange={(e)=>{setEmail(e.target.value)}} />
                </div>
                <div>
                    <input type="text" name="name" value={name}
                     id='name' placeholder='Full Name'
                     onChange={(e)=>{setName(e.target.value)}} />
                </div>
                <div>
                    <input type="text" name="username" value={userName}
                     id='username' placeholder='Username' 
                     onChange={(e)=>{setuserName(e.target.value)}}/>
                </div>
                <div>
                    <input type="password" name="password" value={password}
                     id='password' placeholder='Password' 
                     onChange={(e)=>{setPassword(e.target.value)}}/>
                </div>
            <p className='loginPara' style={{fontSize:"12px",margin:"3px 0px"}}>
                By signin up, term and  
                <br/> condotion cookies policy
            </p>
            <input type="submit" 
       id='submit-btn' 
       value="Sign Up"
       onClick={() => postData()} />
                
            </div>
            <div className='form2'>
                Already have an Account?
                <Link to="/signin">
                <span
                style={{color:"blue",
                cursor:"pointer"}}>
                    Sign In
                </span>
                </Link>
                
            </div>
            
        </div>
    </div>
  )
}

export default SignUp