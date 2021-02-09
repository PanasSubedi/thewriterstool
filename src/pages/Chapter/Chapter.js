import React, { useState, useEffect } from 'react';

import { Editor } from '@tinymce/tinymce-react';

function Chapter() {

  const [content, setContent] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState('Edit');

  useEffect(() => {
    setEditText(editMode ? 'Save' : 'Edit');
  }, [editMode])

  const editHandler = event => {
    setEditMode(!editMode)
    event.preventDefault()
  }

  return (
    <div className="app">
      <div className="buttons">
        <button onClick={editHandler}>{editText}</button> | Link | Back
      </div>
      <div className="title">
        Chapter 1 - Title
      </div>
      <div className='main-area'>
        { (content === '') && !editMode && 'Edit to add content' }
        { !editMode && (
          <div dangerouslySetInnerHTML={{
            __html: content
          }}></div>
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
      </div>
    </div>
  );
}

export default Chapter;
