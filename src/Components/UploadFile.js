import React,{useState} from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import MovieIcon from '@material-ui/icons/Movie';
import LinearProgress from '@mui/material/LinearProgress';
import {v4 as uuidv4} from 'uuid'
import { database,storage } from '../firebase';
import TextField from '@mui/material/TextField';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Box from '@mui/material/Box';
//import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

function UploadFile(props) {
    console.log(props.user);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const [container,setContainer] = useState('');
    const [file,setFile] = useState('')

    const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

    const handleChange = async() => {

        if(file==null){
            setError("Please select a file first");
            setTimeout(()=>{
                setError('')
            },2000)
            return;
        }
        if(file.size/(1024*1024)>100){
            setError('This video is very big');
            setTimeout(()=>{
                setError('')
            },2000);
            return;
        }
        let uid = uuidv4();
        setLoading(true);
        const uploadTask = storage.ref(`/posts/${uid}/${file.name}`).put(file);
            uploadTask.on('state_changed',fn1,fn2,fn3);
            function fn1(snapshot){
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                console.log(`Upload is ${progress} done.`)
            }
            function fn2(error){
                setError(error);
                setTimeout(()=>{
                    setError('')
                },2000);
                setLoading(false)
                return;
            }
            function fn3(){
                uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
                    console.log(url);
                    let obj = {
                        likes:[],
                        comments:[],
                        caption: container,
                        pId:uid,
                        pUrl:url,
                        expertise: props.user.expertAt,
                        uName : props.user.fullname,
                        uProfile : props.user.profileUrl,
                        userId : props.user.userId,
                        createdAt : database.getTimeStamp()
                    }
                    database.posts.add(obj).then(async(ref)=>{
                        let res = await database.users.doc(props.user.userId).update({
                            postIds : props.user.postIds!=null ? [...props.user.postIds,ref.id] : [ref.id]
                        })
                    }).then(()=>{
                        setLoading(false)
                        setContainer('')
                        setOpen(false)
                    }).catch((err)=>{
                        setError(err)
                        setTimeout(()=>{
                            setError('')
                        },2000)
                        setLoading(false)
                    })
                })
                // setLoading(false);
            }
    }

    return (
        <div style={{marginTop:'5rem',marginBottom:'1rem'}}>
            {
                error!=''?<Alert severity="error">{error}</Alert>:
                    <>
                        <Button onClick={handleOpen} variant="outlined" color="secondary" component="span" disabled={loading}><MovieIcon/>&nbsp;Upload Post</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                         <Box sx={style}>
                    <TextField id="outlined-basic" label="Type Content" variant="outlined" fullWidth={true} margin="dense" size="small" value={container} onChange={(e) => setContainer(e.target.value)} />
                    {/* <input type="file" accept="image/*" value={photo} onChange={(e)=>setPhoto(e.target.value)} id="upload-input"  />
                    <label htmlFor="upload-input">
                        <Button
                            variant="outlined"
                            color="secondary"
                            component="span"
                            disabled={loading}
                            onClick={()=>handleChange({photo})}
                        >
                        <MovieIcon/>&nbsp;Upload Post
                        </Button>
                    </label> */}
                     <Button color="secondary" fullWidth={true} variant="outlined" margin="dense" startIcon={<CloudUploadIcon />} component="label">
                            Upload Image
                            <input type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files[0])} />
                        </Button>
                        <Button color="primary" fullWidth={true} variant="contained" disabled={loading} onClick={handleChange}>
                            Create Post
                        </Button>   
                    {loading && <LinearProgress color="secondary" style={{marginTop:'3%'}} />}
                    </Box>
                    </Modal>

                </>
            }
        </div>
    )
}

export default UploadFile
