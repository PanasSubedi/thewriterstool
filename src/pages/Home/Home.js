import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import MenuIcon from '@material-ui/icons/Menu';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

import Listings from '../../components/Listings';
import Text from '../../components/Text';

import Snackbar from '@material-ui/core/Snackbar';

import { makeStyles } from '@material-ui/core/styles';

import { getPageData, getPageTabs, getPageContent,
          storeNewTab, storeNewPage, storePageText,
          editPageTitle, deletePage, deleteTab,
          modifyTabName } from '../../helpers/storage';

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

  const [renameTabsDialogOpen, setRenameTabsDialogOpen] = useState(false);
  const [renameTabsSelectedTab, setRenameTabsSelectedTab] = useState(0);
  const [renameTabsText, setRenameTabsText] = useState('');

  const [editTitleDialogOpen, setEditTitleDialogOpen] = useState(false);
  const [pageNewTitle, setPageNewTitle] = useState('');

  const [pageContent, setPageContent] = useState({});

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [reloadButton, showReloadButton] = useState(false);

  useEffect(() => {
    getPageData(pageID).then(
      data => {

        setPageTitle(data.title)
        setPageType(data.type)

        if (pageID === '0' && data.title === undefined){
          showReloadButton(true);
        }

        if (pageID !== '0') {
          document.title = `${data.title} - The Writer's Tool`
        }
        else {
          document.title = data.title
        }

        if(data.type === 'list'){
          getPageTabs(pageID).then(
            data => {
              if (pageID === '0' && data.length < 2){
                showReloadButton(true);
              }

              setTabs(data);
            }
          ).catch(
            () => {
              alert('Error connecting to the API')
            }
          );
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

  const renameTab = () => {
    modifyTabName(renameTabsSelectedTab, renameTabsText).then(
      result => {
        if (result){
          setTabs(prevTabs => {
            let newTabs = [];
            prevTabs.forEach(tab => {
              if (tab._id === renameTabsSelectedTab){
                let newTab = tab;
                newTab.title = renameTabsText;
                newTabs.push(newTab);
              }
              else {
                newTabs.push(tab);
              }
            })
            return newTabs;
          })
        }
        else {
          setSnackbarMessage('Failed to edit tab name');
          setSnackbarOpen(true);
        }
      }
    )

    setRenameTabsDialogOpen(false);
  }

  const handleRenameTabSelectChange = event => {
    setRenameTabsSelectedTab(event.target.value);
    setRenameTabsText(tabs.filter(tab => tab._id === event.target.value)[0].title);
  }

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

  const handleTabDelete = (event, tabID) => {
    event.stopPropagation()

    deleteTab(tabID).then(
      result => {
        if (result){
          setTabs(prevTabs => {
            return prevTabs.filter(tab => tab._id !== tabID)
          })
        }
        else {
          setSnackbarMessage('Tab cannot be deleted. Either it is not empty, or it is a non-modifiable tab.')
          setSnackbarOpen(true)
        }
      }
    )
  }

  const handleDeletePage = () => {
    deletePage(pageID).then(
      result => {
        if (result){
          history.goBack()
        }
        else {
          setSnackbarMessage('Please empty this page first')
          setSnackbarOpen(true);
        }
      }
    )
    setShowMenu(false);
  }

  const handleRenameTabsDialogOpen = () => {
    setRenameTabsSelectedTab(tabs[0]._id);
    setRenameTabsText(tabs[0].title);
    setRenameTabsDialogOpen(true);
    setShowMenu(false);
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
    editPageTitle(pageID, pageNewTitle).then(
      () => setPageTitle(pageNewTitle)
    ).catch(
      () => alert('Cannot connect to API')
    )
    setEditTitleDialogOpen(false);
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container justify="space-between">

        <Grid item>
          { (pageID !== '0') && (
            <IconButton
              aria-controls="back-button"
              onClick={() => { history.goBack() }}
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>
          )}
        </Grid>

        <Grid item>
          { !reloadButton && (<Typography variant="h5">{ pageTitle }</Typography>) }
          { reloadButton && (<>
              <Typography>Initializing database...</Typography>
              <Button onClick={() => {window.location.reload()}}>reload page</Button>
            </>)}
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


      { (pageType === 'list') && (<Listings pageContent={pageContent} tabs={tabs} addNewPage={addNewPage} handleTabDelete={handleTabDelete} />)}
      { (pageType === 'text') && (<Text pageContent={pageContent} setPageContent={setPageContent} updatePageText={updatePageText} />)}

      <Menu
        id="simple-menu"
        anchorEl={showMenu}
        keepMounted
        open={Boolean(showMenu)}
        onClose={() => setShowMenu(null)}
      >
        { pageID !== '0' && (<MenuItem onClick={handleEditTitleDialogOpen}>Edit Title</MenuItem>) }
        { pageID !== '0' && (<MenuItem onClick={handleDeletePage}>Delete Page</MenuItem>) }
        { pageType === 'list' && (
            <MenuItem onClick={handleNewTabDialogOpen}>New Tab</MenuItem>
        ) }

        { (pageType === 'list') && (tabs.length > 0) && (
            <MenuItem onClick={handleRenameTabsDialogOpen}>Rename Tabs</MenuItem>
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
        open={renameTabsDialogOpen}
        onClose={() => setRenameTabsDialogOpen(false)}
        aria-labelledby="form-dialog"
      >
        <DialogTitle>Rename Tabs</DialogTitle>
        <DialogContent>

          <InputLabel shrink={true} id="select-tab">Tab</InputLabel>
          <Select
            fullWidth
            labelId="select-tab"
            value={renameTabsSelectedTab}
            onChange={handleRenameTabSelectChange}
          >
            { tabs.map(tab => (
              <MenuItem key={tab._id} value={tab._id}>{tab.title}</MenuItem>
            )) }
          </Select><br /><br />

          <TextField
            fullWidth
            label="New Name"
            type="text"
            value={renameTabsText}
            onChange={event => setRenameTabsText(event.target.value)}
          />

          <DialogContentText>
            Provide the new name for the tab.
          </DialogContentText>

        </DialogContent>

        <DialogActions>
          <Button onClick={renameTab} color="primary">
            Rename
          </Button>
          <Button onClick={() => setRenameTabsDialogOpen(false)} color="primary">
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />

    </Container>
  )
}

export default Home;
