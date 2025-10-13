import { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
//import ResetPasswordDialog from './ResetPassword';
// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Avatar,
    Box,
    // Card,
    // CardContent,
    Chip,
    ClickAwayListener,
    Divider,
    // Grid,
    // InputAdornment,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    // OutlinedInput,
    Paper,
    Popper,
    Stack,Button,
    // Switch,
    Typography
} from '@mui/material';
// import { IconKey } from '@tabler/icons-react';
//import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

// third-party
import { FormattedMessage } from 'react-intl';
import PerfectScrollbar from 'react-perfect-scrollbar';

import moment from 'moment-timezone'

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
// import UpgradePlanCard from './UpgradePlanCard';
import useAuth from 'hooks/useAuth';
import User1 from 'assets/images/users/user-round.svg';
import Loader from '../../../../ui-component/Loader';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';
// assets
import { IconLogout,  IconSettings } from '@tabler/icons';
import useConfig from 'hooks/useConfig';
const API_URL = process.env.REACT_APP_LOCAL_API_URL;

// ==============================|| PROFILE MENU ||============================== //
const ProfileSection = () => {
    const theme = useTheme();
    const { borderRadius } = useConfig();
    const [showload, setshowload] = useState(false);
    const currentdatetime =  moment().tz('Asia/Kolkata').format('DD-MM-YYYY hh:mm:ss A')
    // const navigate = useNavigate();

    // const [sdm, setSdm] = useState(true);
    // const [value, setValue] = useState('');
    // const [notification, setNotification] = useState(false);
    // const [selectedIndex, setSelectedIndex] = useState(-1);
    const { logout, user } = useAuth();
    const [open, setOpen] = useState(false);
    // const [openDialog, setOpenDialog] = useState(false);
  
    /**
     * anchorRef is used on different components and specifying one type leads to other components throwing an error
     * */
    const anchorRef = useRef(null);
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };
    // const handleListItemClick = (event, index, route = '') => {
    //     setSelectedIndex(index);
    //     handleClose(event);

    //     if (route && route !== '') {
    //         navigate(route);
    //     }
    // };
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const prevOpen = useRef(open);
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    const handleBackup = async () => {
        // Show loading state
        setshowload(true);
    
        try {
            const response = await axios.get(`${API_URL}db/backup`, {
                responseType: 'blob', // Expecting a binary response (zip file)
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${currentdatetime}-DB-backup.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove(); 
            window.URL.revokeObjectURL(url);
            setshowload(false);
        } catch (error) {
            console.error('Error downloading the backup:', error);
            alert('Failed to download the backup. Please try again later.');
            setshowload(false);
        }
    };

   // open dialog for rest password
//    const handleResetPasswordOpen = () => {
//     setOpenDialog(true);
//     };
   
   // close the dialog after the password submission
//     const handleResetPasswordClose = () => {
//     setOpenDialog(false);
//    };
  
    return (
        <>
             { showload ? <Loader /> : ''}
             <Button
                variant="contained"
                color="primary"
                onClick={handleBackup}
                sx={{ marginRight: '30px' }}  
                disabled={showload}
                startIcon={<DownloadIcon />}  
            >
                DB Backup
            </Button>
                
            <Chip
                sx={{
                    height: '48px',
                    alignItems: 'center',
                    borderRadius: '27px',
                    transition: 'all .2s ease-in-out',
                    borderColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.primary.light,
                    '&[aria-controls="menu-list-grow"], &:hover': {
                        borderColor: theme.palette.primary.main,
                        background: `${theme.palette.primary.main}!important`,
                        color: theme.palette.primary.light,
                        '& svg': {
                            stroke: theme.palette.primary.light
                        }
                    },
                    '& .MuiChip-label': {
                        lineHeight: 0
                    }
                }}
                icon={
                    <Avatar
                        src={User1}
                        sx={{
                            ...theme.typography.mediumAvatar,
                            margin: '8px 0 8px 8px !important',
                            cursor: 'pointer'
                        }}
                        ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        alt="user-account"
                    />
                }
                label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
                variant="outlined"
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
                color="primary"
            />

            <Popper
                placement="bottom"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                modifiers={[
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 14]
                        }
                    }
                ]}
            >
                {({ TransitionProps }) => (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Transitions in={open} {...TransitionProps}>
                            <Paper>
                                {open && (
                                    <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                                        <Box sx={{ p: 2, pb: 0 }}>
                                            <Stack>
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <Typography variant="h4">Good Morning,</Typography>
                                                    <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                                                        {user?.name}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="subtitle2">{localStorage.getItem('empname')?localStorage.getItem('empname'):''}</Typography>
                                                <br />
                                            </Stack>
                                            {/* <OutlinedInput
                                                sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                                                id="input-search-profile"
                                                value={value}
                                                onChange={(e) => setValue(e.target.value)}
                                                placeholder="Search profile options"
                                                startAdornment={
                                                    <InputAdornment position="start">
                                                        <IconSearch stroke={1.5} size="16px" color={theme.palette.grey[500]} />
                                                    </InputAdornment>
                                                }
                                                aria-describedby="search-helper-text"
                                                inputProps={{
                                                    'aria-label': 'weight'
                                                }}
                                            /> */}
                                            <Divider />
                                        </Box>
                                        <PerfectScrollbar
                                            style={{
                                                height: '100%',
                                                maxHeight: 'calc(100vh - 250px)',
                                                overflowX: 'hidden'
                                            }}
                                        >
                                            <Box sx={{ p: 2, pt: 0 }}>
                                                {/* <UpgradePlanCard />
                                                <Divider /> */}
                                                {/* <Card
                                                    sx={{
                                                        bgcolor:
                                                            theme.palette.mode === 'dark'
                                                                ? theme.palette.dark[800]
                                                                : theme.palette.primary.light,
                                                        my: 2
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Grid container spacing={3} direction="column">
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1">Start DND Mode</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Switch
                                                                            color="primary"
                                                                            checked={sdm}
                                                                            onChange={(e) => setSdm(e.target.checked)}
                                                                            name="sdm"
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item>
                                                                <Grid item container alignItems="center" justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="subtitle1">Allow Notifications</Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Switch
                                                                            checked={notification}
                                                                            onChange={(e) => setNotification(e.target.checked)}
                                                                            name="sdm"
                                                                            size="small"
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    </CardContent>
                                                </Card> */}
                                                <Divider />
                                                <List
                                                    component="nav"
                                                    sx={{
                                                        width: '100%',
                                                        maxWidth: 350,
                                                        minWidth: 300,
                                                        backgroundColor: theme.palette.background.paper,
                                                        borderRadius: '10px',
                                                        [theme.breakpoints.down('md')]: {
                                                            minWidth: '100%'
                                                        },
                                                        '& .MuiListItemButton-root': {
                                                            mt: 0.5
                                                        }
                                                    }}
                                                >
                                                    {/* <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 0}
                                                        onClick={(event) => handleListItemClick(event, 0, '/user/account-profile/profile1')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconSettings stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="account-settings" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={selectedIndex === 1}
                                                        onClick={(event) => handleListItemClick(event, 1, '/user/social-profile/posts')}
                                                    >
                                                        <ListItemIcon>
                                                            <IconUser stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Grid container spacing={1} justifyContent="space-between">
                                                                    <Grid item>
                                                                        <Typography variant="body2">
                                                                            <FormattedMessage id="social-profile" />
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Chip
                                                                            label="02"
                                                                            size="small"
                                                                            color="warning"
                                                                            sx={{ '& .MuiChip-label': { mt: 0.25 } }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                            }
                                                        />
                                                    </ListItemButton> */}
                                                      {/* <ListItemButton
                                                    sx={{ borderRadius: `${borderRadius}px` }}
                                                    onClick={handleResetPasswordOpen}
                                                     >
                                                    <ListItemIcon>
                                                        <IconKey stroke={1.5} size="20px" />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="body2">
                                                                <FormattedMessage id="reset-password" defaultMessage="Reset Password" />
                                                            </Typography>
                                                        }
                                                    />         
                                                </ListItemButton> */}
                                               {/* <ResetPasswordDialog open={openDialog} onClose={handleResetPasswordClose} /> */}
                                                   
                                                    <ListItemButton
                                                        sx={{ borderRadius: `${borderRadius}px` }}
                                                        selected={-1 === 4}
                                                        onClick={handleLogout}
                                                    >
                                                        <ListItemIcon>
                                                            <IconLogout stroke={1.5} size="20px" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={
                                                                <Typography variant="body2">
                                                                    <FormattedMessage id="logout" />
                                                                </Typography>
                                                            }
                                                        />
                                                    </ListItemButton>

                                                </List>
                                            </Box>
                                        </PerfectScrollbar>
                                    </MainCard>
                                )}
                            </Paper>
                        </Transitions>
                    </ClickAwayListener>
                )}
            </Popper>
        </>
    );
};

export default ProfileSection;
