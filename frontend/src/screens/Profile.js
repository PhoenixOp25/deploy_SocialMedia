import React,{useEffect,useState
} from 'react'
import "../css/Profile.css";
import PostDetail from '../components/PostDetail';
import ProfilePic from '../components/ProfilePic';
function Profile() {

  var picLink="https://cdn-icons-png.flaticon.com/128/1144/1144811.png";
  const [pic,setPic]=useState([]);

  const [show,setShow]=useState(false)
  const [posts,setPosts]=useState([])
  const [changePic, setChangePic]=useState(false)
  const [user,setUser]=useState("")
  const toggleDetails=(posts)=>{
    if(show){
      setShow(false);
      //console.log("hide")
    }
    else{
      setShow(true);
      setPosts(posts);
      //console.log(item);
      //console.log("show")
    }
  }

  const changeprofile=()=>{
    if(changePic){
      setChangePic(false)
    }
    else{
      setChangePic(true)
    }
  }

  useEffect(() => {
    fetch(`/user/${JSON.parse(localStorage.getItem("user"))._id}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        setPic(result.posts);
        setUser(result.user);
        //console.log(pic);
      });
  }, []);

  return (
    <div className='profile'>
      {/*profile frame*/}
      <div className='profile-frame'>
        {/*profile pic*/}
        <div className='profile-pic'>
         < img onClick={changeprofile} src={user.Photo?user.Photo:picLink} alt=''/>
        </div>
        {/*profile data*/}
        <div className='profile-data'>
            <h1>{JSON.parse(localStorage.getItem("user")).name}</h1>
            <div className='profile-info' style={{display:"flex}"}}>
                <p>{pic?pic.length:"0"} posts</p>
                <p>{user.followers?user.followers.length:"0"} followers</p>
                <p>{user.following?user.following.length:"0"} following</p>
            </div>
        </div>
      </div>
      <hr style={{
        width:"90%",
        margin:"auto",
        opacity:".8",
        margin:"25px auto"
      }}/>
      {/*Galeery*/}
      <div className="gallery">
        {pic.map((pics) => {
          return <img key={pics._id} src={pics.photo}
            onClick={() => {
              toggleDetails(pics)
            }}
            className="item"></img>;
        })}
      </div>
{
  show&&<PostDetail item={posts} toggleDetails={toggleDetails}/>
}
{
  changePic&& 
  <ProfilePic changeprofile={changeprofile}></ProfilePic>
}

    </div>
  )
}

export default Profile