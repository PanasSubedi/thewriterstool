import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

import Listings from '../../components/Listings';
import Text from '../../components/Text';

import { makeStyles } from '@material-ui/core/styles';

import { getPageData, getPageTabs, getPageContent, storeNewTab, storeNewPage, storePageText } from '../../helpers/storage';

const useStyles = makeStyles({
  root:{
    marginTop: '20px',
  },
  bordered: {
    border: '1px solid #eee',
    borderRadius: '2px',
    margin: '20px 0px',
    padding: '20px'
  }
});

function Home(props) {

  const classes = useStyles();
  const history = useHistory();

  const [pageID, setPageID] = useState(props.match.params.id || '0');

  const [pageTitle, setPageTitle] = useState('');
  const [pageType, setPageType] = useState('');
  const [tabs, setTabs] = useState([]);

  const [showMenu, setShowMenu] = useState(false);

  const [newTabDialogOpen, setNewTabDialogOpen] = useState(false);
  const [newTabSingularName, setNewTabSingularName] = useState('');
  const [newTabName, setNewTabName] = useState('');

  const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false);
  const [pageNewTitle, setPageNewTitle] = useState('');

  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    getPageData(pageID).then(
      data => {
        setPageTitle(data.title)
        setPageType(data.type)

        if(data.type === 'list'){
          getPageTabs(pageID).then(
            data => {
              setTabs(data);
            }
          ).catch(
            () => {
              alert('Error connecting to the API')
            }
          );;
        }
      }
    ).catch(
      () => {
        alert('Error connecting to the API')
      }
    );

    getPageContent(pageID).then(
      data => {
        setPageContent(data);
      }
    ).catch(
      () => {
        alert('Error connecting to the API')
      }
    );

  }, [pageID])

  history.listen((location, action) => {
    const path = location.pathname.split('/')
    const id = path.length === 2 ? '0' : path[2]
    setPageID(id);
  });

  const updatePageText = () => {
    storePageText(pageID, pageContent.text)
  }

  const addNewPage = (tabID, pageTitle, pageType) => {

    storeNewPage(tabID, pageTitle, pageType).then(
      data => {
        setPageContent(prevContent => {
          if (prevContent[tabID] === undefined){
            prevContent[tabID] = []
          }

          prevContent[tabID].push({
            id: parseFloat(data._id),
            title: pageTitle
          })
          return {...prevContent};
        })
      }
    ).catch(
      () => {
        alert('Unable to connect to the API')
      }
    )
  }

  const addNewTab = () => {
    storeNewTab(pageID, newTabName, newTabSingularName).then(
      data => {
        setTabs(prevTabs => {
          return [...prevTabs, data]
        })
      }
    ).catch(
      () => {
        alert('Error connecting to the API')
      }
    )
    setNewTabDialogOpen(false);
  }

  const handleNewTabDialogOpen = () => {
    setNewTabName('');
    setNewTabSingularName('');
    setNewTabDialogOpen(true);
    setShowMenu(false);
  }

  const handleEditTitleDialogOpen = () => {
    setPageNewTitle(pageTitle);
    setEditTitleDialogOpen(true);
    setShowMenu(false);
  }

  const handleTitleEdit = () => {
    setPageTitle(pageNewTitle);
    setEditTitleDialogOpen(false);
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">{ pageTitle }</Typography>
        </Grid>

        <Grid item>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={event => setShowMenu(event.currentTarget)}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>


      { (pageType === 'list') && (<Listings pageContent={pageContent} tabs={tabs} addNewPage={addNewPage} />)}
      { (pageType === 'text') && (<Text pageContent={pageContent} setPageContent={setPageContent} updatePageText={updatePageText} />)}

      <Menu
        id="simple-menu"
        anchorEl={showMenu}
        keepMounted
        open={Boolean(showMenu)}
        onClose={() => setShowMenu(null)}
      >
        { pageID !== '0' && (<MenuItem onClick={handleEditTitleDialogOpen}>Edit Title</MenuItem>) }
        { pageID !== '0' && (<MenuItem onClick={() => setShowMenu(null)}>Delete Page</MenuItem>) }
        { pageType === 'list' && (
          <MenuItem onClick={handleNewTabDialogOpen}>New Tab</MenuItem>
        ) }
      </Menu>

      <Dialog
        open={newTabDialogOpen}
        onClose={() => setNewTabDialogOpen(false)}
        aria-labelledby="form-dialog"
      >
        <DialogTitle>New Tab</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Title"
            type="text"
            value={newTabName}
            onChange={event => setNewTabName(event.target.value)}
          />

          <TextField
            fullWidth
            label="Singular Value"
            type="text"
            value={newTabSingularName}
            onChange={event => setNewTabSingularName(event.target.value)}
          />

          <DialogContentText>
            Provide the singular noun for the new tab title.
          </DialogContentText>

        </DialogContent>

        <DialogActions>
          <Button onClick={addNewTab} color="primary">
            OK
          </Button>
          <Button onClick={() => setNewTabDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>





      <Dialog
        open={editTitleDialogOpen}
        onClose={() => setEditTitleDialogOpen(false)}
        aria-labelledby="form-dialog"
      >
        <DialogTitle>Edit Page Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Title"
            type="text"
            value={pageNewTitle}
            onChange={event => setPageNewTitle(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTitleEdit} color="primary">
            OK
          </Button>
          <Button onClick={() => setEditTitleDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}

export default Home;
