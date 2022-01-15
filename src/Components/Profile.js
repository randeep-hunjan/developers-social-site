import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import { database } from '../firebase'
import { CircularProgress } from '@mui/material';
import Navbar from './Navbar' 
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Like from './Like'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Dialog from '@mui/material/Dialog';
import Card from '@mui/material/Card';
import Like2 from './Like2';
import AddComment from './AddComment';
import Comments from './Comments'
import './Profile.css'

function Profile() {
    const {id} = useParams()
    const [userData,setUserdata] = useState(null)
    const [posts,setPosts] = useState(null)
    const [open, setOpen] = useState(null);

    const handleClickOpen = (id) => {
        setOpen(id);
    };

    const handleClose = () => {
        setOpen(null);
    };
    useEffect(()=>{
        database.users.doc(id).onSnapshot((snap)=>{
            setUserdata(snap.data())
        })
    },[id])

    useEffect(async()=>{
        if(userData!=null){
        let parr = [];
        for(let i=0;i<userData?.postIds?.length;i++){
            let postData = await database.posts.doc(userData.postIds[i]).get()
            parr.push({...postData.data(),postId:postData.id})
        } 
        setPosts(parr)
    }
    },[userData])

    return (
        <>
        {
            posts==null || userData==null ? <CircularProgress/> : 
            <>
                <Navbar userData={userData}/>
                <div className="spacer"></div>
                <div className="container">
                    <div className="upper-part">
                        <div className="profile-img">
                            <img src={userData.profileUrl}/>
                        </div>
                        <div className="info">
                            <Typography variant="h5" sx={{fontWeight: 'bold' }}>
                                {userData.fullname} [{userData.expertAt}]
                            </Typography>
                            <Typography variant="h6">
                                Email : {userData.email}
                            </Typography>
                            <Typography variant="h6">
                                Posts : {userData?.postIds?.length==undefined?"0":userData?.postIds?.length}
                            </Typography>
                            <Typography variant="h6">
                                LinkedIn : {userData.linkedin}
                            </Typography>
                            <Typography variant="h6">
                                Leetcode : {userData.leetcode}
                            </Typography>
                            <Typography variant="h6">
                                Github : {userData.github}
                            </Typography>
                        </div>
                    </div>
                    <hr style={{marginTop:'3rem',marginBottom:'3rem'}}/>
                    <div className="profile-videos">
                    {
                        posts.map((post,index)=>(
                            <React.Fragment key={index}>
                                <div className="videos">
                                    <img source src={post.pUrl} onClick={()=>handleClickOpen(post.pId)} width="100" height="100">
                                    </img>
                                    <Dialog
                                        open={open==post.pId}
                                        onClose={handleClose}
                                        aria-labelledby="alert-dialog-title"
                                        aria-describedby="alert-dialog-description"
                                        fullWidth ={true}
                                        maxWidth = 'md'
                                    >
                                        <div className="modal-container">
                                            <div className="video-modal">
                                                <img source src={post.pUrl} width="450" height="584"/>
                                            </div>
                                            <div className="comment-modal">
                                            <Card className="card1" style={{padding:'1rem'}}>
                                                <Comments postData={post}/>
                                            </Card>
                                                <Card variant="outlined" className="card2">
                                                    <Typography style={{padding:'0.4rem'}}>{post.likes.length==0?'Liked by nobody':`Liked by ${post.likes.length} users`}</Typography>
                                                    <div style={{display:'flex'}}>
                                                        <Like2 postData={post} userData={userData} style={{display:'flex',alignItems:'center',justifyContent:'center'}}/>
                                                        <AddComment style={{display:'flex',alignItems:'center',justifyContent:'center'}} userData={userData} postData={post}/>
                                                    </div>
                                                </Card>
                                            </div>
                                        </div>
                                    </Dialog>
                                </div>
                            </React.Fragment>
                        ))
                    }
                </div>
                </div>
            </>
        }
        </>
    )
}

export default Profile