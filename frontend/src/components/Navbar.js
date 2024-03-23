import React, { useContext } from 'react'
import logo from "./img/logo.png"
import "../css/Navbar.css"
import {Link} from "react-router-dom"
import { LoginContext } from '../context/LoginContext'
import { useNavigate } from 'react-router-dom'

/*if we use href in place of link, site 
will refresh again and again*/ 
function Navbar( {login}) {
  const navigate=useNavigate();
  const {setModalOpen}=useContext(LoginContext)
  const loginStatus=()=>{
    const token=localStorage.getItem("jwt");
    if(login|| token ){
      return [
        <>
        <Link to="/profile">
        <li>Profile</li>
        </Link>
        <Link to="/createPost">
          Create Post
        </Link>
        <Link style={{marginLeft:"20px"}} to="/followingpost"> My Following Post </Link>
        <Link to={""}>
          <button className='primaryBtn' onClick={()=>setModalOpen(true)}>

          Log Out
          </button>
        </Link>
        </>

      ]
    }else{
      return [
        <>
        <Link to="/signup">
        <li>SignUp</li>
        </Link>
        <Link to="/signin">
        <li>SignIn</li>
        </Link>
        </>
      ]
    }
  }
  loginStatus();
  return (
    <div className="Navbar">
        <img src={logo} onClick={()=>{navigate("/")}} alt=''/>
        <ul className='nav-menu'>
        {loginStatus()}
        </ul>
    </div>
  )
}

export default Navbar