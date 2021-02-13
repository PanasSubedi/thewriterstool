const getPageTitle = pageID => {
  if (pageID === '0'){
    return 'The Writer\'s Friend';
  }

  else if (pageID === '1'){
    return  'Story 1';
  }

  else if (pageID === '2'){
    return 'Chapter 1';
  }
}

const getPageType = pageID => {
  if (pageID === '2'){
    return 'text';
  }
  else {
    return 'list';
  }
}

const getPageContent = pageID => {
  if (pageID === '0'){
    return {
      stories: [
        {id: '1', title: 'Story 1'},
        {id: '2', title: 'Story 2'},
        {id: '3', title: 'Story 3'},
      ],
      ideatopics: [
        {id: '1', title: 'Idea 1'},
        {id: '2', title: 'Idea 2'},
        {id: '3', title: 'Idea 3'},
        {id: '4', title: 'Idea 4'},
      ]
    };
  }

  else if (pageID === '1'){
    return {
      chapters: [
        {id: '1', title: 'Chapter 1'},
        {id: '2', title: 'Chapter 2'},
        {id: '3', title: 'Chapter 3'},
      ],
      characters: [
        {id: '1', title: 'Character 1'},
        {id: '2', title: 'Character 2'},
        {id: '3', title: 'Character 3'},
        {id: '4', title: 'Character 4'},
      ],
      outline: [
        {id: '1', title: 'Outline 1'},
      ]
    };
  }

  else if (pageID === '2'){
    return {
      text: '<p>Some content with <strong>bolding </strong>and <em>italics</em>.</p>'
    };
  }
}

const getTabs = pageID => {

  if (pageID === '0'){
    return [
      {
        id: '1',
        title: 'Stories',
        singular: 'Story',
      },

      {
        id: '2',
        title: 'Idea Topics',
        singular: 'Idea Topic',
      },
    ];
  }
  else if (pageID === '1') {
    return [
      {
        id: '1',
        title: 'Chapters',
        singular: 'Chapter',
      },
      {
        id: '2',
        title: 'Characters',
        singular: 'Character',
      },
      {
        id: '3',
        title: 'Outline',
        singular: 'Outline',
      },
    ];
  }
}

export { getTabs, getPageTitle, getPageType, getPageContent };
