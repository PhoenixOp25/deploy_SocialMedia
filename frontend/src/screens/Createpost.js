import React,{useState,useEffect} from 'react'
import"../css/Createpost.css";
import {toast} from "react-toastify"
import { useNavigate } from 'react-router-dom';


function Createpost() {

    const [body,setBody]=useState("");
    const [image,setImage]=useState("");

    const[url,setUrl]=useState("");
    const navigate=useNavigate();
    const notifyA = (msg) => toast.error(msg)
    const notifyB = (msg) => toast.success(msg)
    //posting image to cloudinary
    useEffect(()=>{
        if(url){
            fetch("/createPost",{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer " + localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                body,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{if(data.error){
            notifyA(data.error)
        }
    else{
        notifyB("Successfully posted bro")
        navigate("/")
    }})
        .catch(err=>console.log(err))
        }
    },[url])
    const postDetails=()=>{
        console.log(body,image);
        const data=new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","phoenixinsta")
        fetch("https://api.cloudinary.com/v1_1/phoenixinsta/image/upload",{
            method:"post",
            body:data
        }).then(res=>res.json())
        .then(data=>setUrl(data.url))
        .catch(err=>console.log(err))

        //saving post to mongo db
        


    }


    const loadfile = (event) => {
        var output = document.getElementById("output");
        output.src = URL.createObjectURL(event.target.files[0]);
        output.onload = function () {
          URL.revokeObjectURL(output.src); // free memory
        };
      };

  return (
    <div className='createPost'>
        {/*header*/}
     <div className='post-header'>
            <h4 style={{margin:"3px auto"}}>Create new post</h4>
            <button id="post-button" onClick={()=>{postDetails()}}>Share</button>
        </div>
        {/*pic previw*/}
        <div className='main-div'
            >
            <img id="output" src='https://pixsector.com/cache/517d8be6/av5c8336583e291842624.png'/>
                <input type='file' accept='image/*' onChange={(event)=>{loadfile(event);
                setImage(event.target.files[0])
                }}/>
        </div>
        {/*details*/ }
        <div className='details'>
            <div className='card-header'>
                <div className='card-pic'>
                    <img src="https://square-vn.com/app/dscms/assets/images/person-3.jpg?v=1653932875 " alt=""/>
                </div>
                <h5>Riya</h5>
            </div>
            <textarea value={body}  onChange={(e)=>{
                setBody(e.target.value)
            }} type="text" placeholder='write a caption' ></textarea>
        </div>
    </div>
  )
}

export default Createpost