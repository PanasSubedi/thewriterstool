import React, { useState, useEffect } from 'react';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Typography from '@material-ui/core/Typography';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';

import { makeStyles } from '@material-ui/core/styles';

import { getStories, getIdeas } from '../../helpers/storage';

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
          <Typography>{children}</Typography>
        </Container>
      )}
    </div>
  );
}

function Home() {
  const classes = useStyles();

  const [stories, setStories] = useState([]);
  const [ideas, setIdeas] = useState([]);

  const [showMenu, setShowMenu] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    setStories(getStories());
    setIdeas(getIdeas());
  }, [])


  return (
    <Container maxWidth="lg" className={classes.root}>

      <Grid container justify="space-between">
        <Grid item>
          <Typography variant="h5">The Writer's Friend</Typography>
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
            <MenuItem>New Story</MenuItem>
            <MenuItem>New Idea Topic</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <Paper square>
        <Tabs
          value={tabValue}
          indicatorColor="primary"
          textColor="primary"
          onChange={(event, newValue) => setTabValue(newValue)}
          aria-label="disabled tabs example"
        >
          <Tab label="Stories" />
          <Tab label="Ideas" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <List>
            { stories.map(story => (
              <>
                <ListItem key={story.id} button>
                  <ListItemText primary={story.title} />
                </ListItem>
                <Divider />
              </>
            )) }
          </List>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <List>
            { ideas.map(ideaTopic => (
              <>
                <ListItem key={ideaTopic.id} button>
                  <ListItemText primary={ideaTopic.title} />
                </ListItem>
                <Divider />
              </>
            )) }
          </List>
        </TabPanel>

      </Paper>

    </Container>
  )
}

export default Home;
