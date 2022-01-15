import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {useHistory} from 'react-router-dom';
import {AuthContext} from '../Context/AuthContext'
import {makeStyles} from '@mui/styles';
import {useEffect} from 'react'
import insta from '../Assets/Instagram.JPG';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ExploreIcon from '@mui/icons-material/Explore';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {database} from '../firebase';
import './Navbar.css'

const useStyles = makeStyles({
    appb:{
        background : 'white'
    }
})


export default function Navbar({userData}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const history = useHistory();
  const {logout} = React.useContext(AuthContext)
  const classes = useStyles()
  const [open, setOpen] = React.useState(false);
  const [currText,setCurr] = React.useState('');
  const [info , setInfo] = React.useState([]);
  const [result, setResult] = React.useState([]);
  const [id, setId] = React.useState([]);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleprofile = () => {
    history.push(`/profile/${userData.userId}`)
  }
  const handlebannerclick = () => {
      history.push('/')
  }
  const handlelogout = async() => {
      await logout()
      history.push('/login')
  }
  const handleexplore = () => {
      let win =window.open('https://www.pepcoding.com','_blank');
      win.focus();
  }

  const handleRedirect = (event) => {
    history.push(`/profile/${event.target.value}`)
    setOpen(false);
  }

  const handleSearch=(event)=>{
      setCurr(event.target.value)
      console.log(userData)
      // var comp=database.users.orderBy('createdAt','desc').onSnapshot((querySnapshot)=>{
      // querySnapshot.forEach((doc)=>{
      //   console.log(doc.id)})
      // })
      // database().ref("users").on("value", snapshot => {
      //   snapshot.forEach(snap => {
      //   console.log(snap.val())})})
    //   database.users.get().then((querySnapshot) => {
    //     querySnapshot.forEach(element => {
    //         var data = element.data();
    //         setInfo(arr => [...arr , data]);  
    //     });
    // })
    // console.log(info);
    // setInfo([]);
    // console.log(info);
    let parr=[]
    let narr=[]
    info.map((post,index)=>{
     let title = post.expertAt.toLowerCase();
     if(title.includes(currText.toLowerCase())){ parr.push(post.fullname); narr.push(post.userId) }
     })
     setResult(parr)
     setId(narr)
     console.log(result)
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleprofile}><AccountCircleIcon/><p>&nbsp;&nbsp;</p>Profile</MenuItem>
      <MenuItem onClick={handlelogout}><ExitToAppIcon/><p>&nbsp;&nbsp;</p>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
        <MenuItem onClick={handleprofile}><AccountCircleIcon/><p>&nbsp;&nbsp;</p>Profile</MenuItem>
      <MenuItem onClick={handlelogout}><ExitToAppIcon/><p>&nbsp;&nbsp;</p>Logout</MenuItem>
    </Menu>
  );

  useEffect(()=>{
    // let parr = []
    // const unsub = database.posts.orderBy('createdAt','desc').onSnapshot((querySnapshot)=>{
    //     parr = []
    //     querySnapshot.forEach((doc)=>{
    //         let data = {...doc.data(),postId:doc.id}
    //         parr.push(data)
    //     })
    //     setPosts(parr)
    // })
    // return unsub
     //   console.log(snap.val())})})
     database.users.get().then((querySnapshot) => {
      querySnapshot.forEach(element => {
          var data = element.data();
          setInfo(arr => [...arr , data]);  
      })
    })
    setInfo([]);
},[])

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{background:'white'}}> 
        <Toolbar>
          <div style={{ marginLeft: '5%' }}>
            <img src={insta} style={{ width: '20vh' }} onClick={handlebannerclick} />
          </div>
          {/* <div className='searchBar' style={{marginLeft:'50vh'}}>
          <TextField
          id="outlined-password-input"
          label="Search"
          fullWidth={true} margin="dense" size="small"
        /> */}
          <div className="searchBar" style={{marginLeft:'clamp(5vw, 27vw, 100vw)'}}>
            <Button variant="outlined" onClick={handleClickOpen}>
              Click to search
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth='sm'>
              <div className='main-search'>
                <div className="search-modal">
                  <DialogContent>
                    <TextField
                      id="outlined-password-input"
                      label="Search"
                      fullWidth={true} margin="dense" size="small"
                      value={currText}
                      onChange={handleSearch}
                    />
                  </DialogContent>
                </div>
                <div className='result-modal'>
                {
                  currText!=""?
                result.map((name,index)=>(
                <Button variant="outlined" fullWidth={true} value={id[index]} onClick={handleRedirect}>{name}</Button>  
                )):<div></div>
                }
                {/* <Button variant="outlined" fullWidth={true}>Primary</Button>
                <Button variant="outlined" fullWidth={true}>Primary</Button>
                <Button variant="outlined" fullWidth={true}>Primary</Button> */}
                </div>
              </div>
              {/* <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Subscribe</Button>
              </DialogActions> */}
            </Dialog>
          </div>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: 'none', md: 'flex' }, color: 'black', alignItems: 'center', marginRight: '4rem' }}>
          <HomeIcon onClick={handlebannerclick} sx={{ marginRight: '1.5rem', cursor: "pointer" }} />
          <SendIcon onClick={handleexplore} sx={{ marginRight: '1rem', cursor: "pointer" }} />
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <Avatar src={userData?.profileUrl} sx={{ height: '2rem', width: '2rem' }} />
          </IconButton>
        </Box>
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>

          <IconButton
            size="large"
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
      { renderMobileMenu }
  { renderMenu }
    </Box >
  );
}
