import React, { useState } from 'react';

import Paper from '@material-ui/core/Paper';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { Editor } from '@tinymce/tinymce-react';

import { makeStyles } from '@material-ui/core/styles';

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

function Text({ pageContent }){

  const classes = useStyles();

  const [content, setContent] = useState(pageContent.text);
  const [editMode, setEditMode] = useState(false);

  const editHandler = event => {
    setEditMode(!editMode);
  }

  return (
    <Paper square className={`${classes.root} ${classes.bordered}`}>

      <Paper elevation={0} style={{textAlign:'right'}}>
        <FormControlLabel
          control={
            <Switch
              checked={editMode}
              onChange={editHandler}
              color="primary"
            />
          }
          label="Edit"
        />
      </Paper>

      { (content === '') && !editMode && 'Edit to add content' }

      { !editMode && (
        <Paper elevation={0} dangerouslySetInnerHTML={{
          __html: content
        }}></Paper>
      ) }

      { editMode && (
        <Editor
          apiKey='opbkrxx8zzedh49lu3wzz3zwg7o3dv8d2z0x8cxnlm1sv4fj'
          initialValue={content}
          init={{
            height: 600,
            menubar: true,
            toolbar: false,
            plugins: [
              'advlist autolink lists link charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount'
            ]
          }}
          onEditorChange={(content, editor) => {setContent(content)}}
        />
      ) }
    </Paper>
  )
}

export default Text;
