import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

import { getTabs } from '../../helpers/storage';

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container className={classes.bordered}>
          {children}
        </Container>
      )}
    </div>
  );
}

function Listings({ pageID, pageContent }) {

  const classes = useStyles();
  const history = useHistory();

  const [tabs, setTabs] = useState([]);
  const [tabValue, setTabValue] = useState(0);

  const [showMenu, setShowMenu] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  const [newTabType, setNewTabType] = useState('text');

  useEffect(() => {
    setTabs(getTabs(pageID));
  }, [pageID]);

  const handleDialogOpen = formTitle => {
    setFormTitle(formTitle);
    setDialogOpen(true);
    setShowMenu(false);
  }

  const getChildURL = (tabTitle, listItemID) => {
    return '/'+tabTitle.replace(' ', '').toLowerCase()+'/'+listItemID
  }

  return (
    <>
    <Paper square className={classes.root}>
      <Grid container justify="space-between">
        <Grid item>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newValue) => setTabValue(newValue)}
            aria-label="disabled tabs example"
          >
            { tabs.map(tab => (
              <Tab key={tab.id} label={ tab.title }/>
            )) }
          </Tabs>
        </Grid>

        <Grid item>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={event => {setShowMenu(event.currentTarget)}}
          >
            <AddIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={showMenu}
            keepMounted
            open={Boolean(showMenu)}
            onClose={() => setShowMenu(null)}
          >
            {
              tabs.map(tab => (
                <MenuItem key={tab.id} onClick={() => handleDialogOpen(tab.singular)}>New {tab.singular}</MenuItem>
              ))
            }
            <MenuItem onClick={() => handleDialogOpen('Tab')}>New Tab</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      {
        tabs.map((tab, index) => (
          <TabPanel key={tab.id} value={tabValue} index={index}>
            <List>
              { pageContent[tab.title.replace(' ', '').toLowerCase()].map(listValues => (
                <ListItem divider={true} key={listValues.id} button>
                  <ListItemText onClick={() => history.push(getChildURL(tab.singular, listValues.id))} primary={listValues.title} />
                </ListItem>
              )) }
            </List>
          </TabPanel>
        ))
      }

    </Paper>

    <Dialog
      open={dialogOpen}
      onClose={() => setDialogOpen(false)}
      aria-labelledby="form-dialog"
    >
      <DialogTitle>New { formTitle }</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Title"
          type="text"
        />

        { (formTitle === 'Tab') && (<><br /><br /><br />
        <FormLabel component="legend">Tab Type</FormLabel>
        <RadioGroup
          aria-label="tab-type"
          name="tab-type"
          value={newTabType}
          onChange={event => setNewTabType(event.target.value)}
        >
          <FormControlLabel value="text" control={<Radio color="primary" />} label="Text" />
          <FormControlLabel value="list" control={<Radio color="primary" />} label="List" />
        </RadioGroup></>)}

      </DialogContent>
      <DialogActions>
        <Button color="primary">
          Add
        </Button>
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )

}

export default Listings;
