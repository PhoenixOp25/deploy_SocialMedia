import React,{useEffect,useState
} from 'react'
import "../css/Profile.css";
import PostDetail from './PostDetail';
import { useParams } from 'react-router-dom';

var picLink="https://cdn-icons-png.flaticon.com/128/1144/1144811.png";


function UserProfile() {
  const [user,setUser]=useState("");
    const {userid} = useParams();
    const [isFollow, setIsFollow]=useState(false);
    console.log(userid);
 // const [show,setShow]=useState(false)
  const [posts,setPosts]=useState([])

//to follow user
const followeUser=(userId)=>{
  fetch("/follow",{
    method:"put",
    headers: {
      "Content-Type":"application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body:JSON.stringify({
      followId:userId
    })
  })
  .then((res)=>res.json())
  .then((data)=>{
    console.log(data)
    setIsFollow(true);
  })
}

const unfollowUser=(userId)=>{
  fetch("/unfollow",{
    method:"put",
    headers: {
      "Content-Type":"application/json",
      Authorization: "Bearer " + localStorage.getItem("jwt"),
    },
    body:JSON.stringify({
      followId:userId
    })
  })
  .then((res)=>{res.json()})
  .then((data)=>{
    console.log(data)
    setIsFollow(false);
  })
}

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUser(result.user)
        setPosts(result.posts)
        if(result.user.followers.includes(JSON.parse(localStorage.getItem("user"))._id)){
          setIsFollow(true);
        }
      });
  }, [isFollow]);

  return (
    <div className='profile'>
      {/*profile frame*/}
      <div className='profile-frame'>
        {/*profile pic*/}
        <div className='profile-pic'>
         < img src={user.Photo?user.Photo:picLink} alt=''/>
        </div>
        {/*profile data*/}
        <div className='profile-data'>
          <div style={{display:"flex", alignItems:"center",justifyContent:'space-between'}}>
          <h1>{user.name}</h1>
          <button className='followBtn' onClick={()=>{
            if(isFollow){
              unfollowUser(user._id)
            }
            else{
              followeUser(user._id)
            }
            
          }}>{ isFollow?"Unfollow":"Follow"}</button>
          </div>
            
            <div className='profile-info' style={{display:"flex}"}}>
                <p>{posts.length} Posts</p>
                <p>{user.followers? user.followers.length:"0"} followers</p>
                <p>{user.following? user.following.length:"0"} following</p>
            </div>
        </div>
      </div>
      <hr style={{
        width:"90%",
        margin:"auto",
        opacity:".8",
        margin:"25px auto"
      }}/>
      {/*Gallery*/}
      <div className="gallery">
        {posts.map((pics) => {
          return <img key={pics._id} src={pics.photo}
            // onClick={() => {
            //   toggleDetails(pics)
            // }}
            className="item"></img>;
        })}
      </div>
{/* {
  show&&<PostDetail item={posts} toggleDetails={toggleDetails}/>
} */}

    </div>
  )
}

export default UserProfile