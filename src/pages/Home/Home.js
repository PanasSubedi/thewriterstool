import React, { useState, useEffect } from 'react';

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

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

import Listings from '../../components/Listings';
import Text from '../../components/Text';

import { makeStyles } from '@material-ui/core/styles';

import { getPageTitle, getPageType, getPageContent } from '../../helpers/storage';

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

  const id = props.match.params.id || '0';
  const title = props.match.params.title || '';

  const classes = useStyles();

  const [pageTitle, setPageTitle] = useState('');
  const [pageType, setPageType] = useState('');

  const [pageNewTitle, setPageNewTitle] = useState('');

  const [showMenu, setShowMenu] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [pageContent, setPageContent] = useState({});

  useEffect(() => {
    setPageTitle(getPageTitle(id));
    setPageType(getPageType(id));
    setPageContent(getPageContent(id));
  }, [id])

  const handleDialogOpen = () => {
    setPageNewTitle(pageTitle);
    setDialogOpen(true);
    setShowMenu(false);
  }

  const handleTitleEdit = () => {
    setPageTitle(pageNewTitle);
    setDialogOpen(false);
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">{ pageTitle }</Typography>
        </Grid>
        { (id !== '0') && (
            <Grid item>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={event => setShowMenu(event.currentTarget)}
              >
                <MenuIcon fontSize="small" />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={showMenu}
                keepMounted
                open={Boolean(showMenu)}
                onClose={() => setShowMenu(null)}
              >
                <MenuItem onClick={handleDialogOpen}>Edit Title</MenuItem>
                <MenuItem onClick={() => setShowMenu(null)}>Delete Page</MenuItem>
              </Menu>
            </Grid>
          )
        }
      </Grid>
      { (pageType === 'list') && (<Listings pageID={id} pageContent={pageContent} />)}
      { (pageType === 'text') && (<Text pageContent={pageContent} />)}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="form-dialog"
      >
        <DialogTitle>Edit { (title !== '') && title[0].toUpperCase() + title.slice(1) } title</DialogTitle>
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
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  )
}

export default Home;
