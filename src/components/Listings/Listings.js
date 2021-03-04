import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';

import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root:{
    marginTop: '20px'
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

function Listings({ pageContent, tabs, addNewPage, handleTabDelete }) {

  const classes = useStyles();
  const history = useHistory();

  const [tabValue, setTabValue] = useState(0);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  const [newPageType, setNewPageType] = useState('text');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [currentTabID, setCurrentTabID] = useState(0);

  const handleAdd = () => {
    setNewPageTitle('');
    setAddDialogOpen(false);

    addNewPage(currentTabID, newPageTitle, newPageType);

  }

  const closeDialog = () => {
    setNewPageTitle('');
    setAddDialogOpen(false);
  }

  const handleAddDialogOpen = (formTitle, tabID) => {
    setFormTitle(formTitle);
    setCurrentTabID(tabID);
    setAddDialogOpen(true);
  }

  const goToPage = pageID => {
    history.push('/ui/'+pageID);
  }

  return (
    <>
    <Paper square className={classes.root}>
      <Tabs
        value={tabValue}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        onChange={(event, newValue) => setTabValue(newValue)}
      >
        { tabs.map(tab => (
          <Tab
            key={tab._id}
            label={
              (
                <Grid container justify="space-between">
                  <Grid item>
                    <Typography>
                      { tab.title }
                    </Typography>
                  </Grid>
                  <Grid item>
                    <CloseIcon
                      fontSize="small"
                      onClick={event => handleTabDelete(event, tab._id)}
                    />
                  </Grid>
                </Grid>
              )
            }
          />
        )) }
      </Tabs>

      {
        tabs.map((tab, index) => (
          <TabPanel key={tab._id} value={tabValue} index={index}>
            <List>
              {
                pageContent[tab._id] !== undefined &&
                pageContent[tab._id].map(listValues => (
                  <ListItem divider={true} key={listValues.id} button>
                    <ListItemText onClick={() => goToPage(listValues.id)} primary={listValues.title} />
                  </ListItem>
                ))
              }
              <ListItem
                divider={true}
                button
                onClick={() => handleAddDialogOpen(tab.singular, tab._id)}
              >
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
              </ListItem>
            </List>
          </TabPanel>
        ))
      }

    </Paper>

    <Dialog
      open={addDialogOpen}
      onClose={closeDialog}
      aria-labelledby="form-dialog"
    >
      <DialogTitle>New { formTitle }</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Title"
          type="text"
          value={newPageTitle}
          onChange={event => setNewPageTitle(event.target.value)}
        />

        <br /><br /><br />
        <FormLabel component="legend">Tab Type</FormLabel>
        <RadioGroup
          aria-label="tab-type"
          name="tab-type"
          value={newPageType}
          onChange={event => setNewPageType(event.target.value)}
        >
          <FormControlLabel value="text" control={<Radio color="primary" />} label="Text" />
          <DialogContentText>
            If you want to add text-based content. For example, if you want to write a chapter, summary, or your musings.
          </DialogContentText>

          <FormControlLabel value="list" control={<Radio color="primary" />} label="List" />
          <DialogContentText>
            If you want to add list-based content with tabs, just like this page.
          </DialogContentText>
        </RadioGroup>

      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleAdd}
        >
          Add
        </Button>
        <Button onClick={closeDialog} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </>
  )

}

export default Listings;
