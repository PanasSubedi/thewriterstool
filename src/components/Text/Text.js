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

function Text({ pageContent, setPageContent, updatePageText }){

  const classes = useStyles();
  const [editMode, setEditMode] = useState(false);

  const handleEditorChange = (content, editor) => {
    setPageContent({
      text: content
    })
  }

  const editHandler = event => {
    if (editMode){
      updatePageText();
    }

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

      { (pageContent.text === '' || pageContent.text === undefined) && !editMode && 'Edit to add content' }

      { !editMode && (
        <Paper elevation={0} dangerouslySetInnerHTML={{
          __html: pageContent.text
        }}></Paper>
      ) }

      { editMode && (
        <Editor
          apiKey='opbkrxx8zzedh49lu3wzz3zwg7o3dv8d2z0x8cxnlm1sv4fj'
          initialValue={pageContent.text}
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
          onEditorChange={handleEditorChange}
        />
      ) }
    </Paper>
  )
}

export default Text;
