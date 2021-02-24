const storePageText = (pageID, text) => {
  return fetch('/api/pages/' + pageID + '/text', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'page_id': pageID,
      'text': text
    })
  })
}

const storeNewPage = (tabID, pageTitle, pageType) => {
  return fetch('/api/pages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'title': pageTitle,
      'tab_id': tabID,
      'type': pageType
    })
  }).then(
    response => response.json()
  ).then(
    data => {
      return data
    }
  )
}

const storeNewTab = (parentID, tabName, tabSingularName) => {
  return fetch('/api/tabs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      'page_id': parentID,
      'title': tabName,
      'singular': tabSingularName
    })
  }).then(
    response => response.json()
  ).then(
    data => {
      return {
        _id: data._id,
        title: tabName,
        singular: tabSingularName
      }
    }
  )
}

const getPageData = pageID => {
  return fetch('/api/pages/'+pageID).then(
    response => response.json()
  ).then(
    data => {
      return data
    }
  );
}

const getPageTabs = pageID => {
  return fetch(
    '/api/pages/' + pageID + '/tabs'
  ).then(
    response => response.json()
  ).then(
    data => {
      return data
    }
  )
}

const getPageContent = pageID => {
  return fetch(
    '/api/pages/' + pageID + '/content'
  ).then(
    response => response.json()
  ).then(
    data => {
      return data
    }
  );
}


export { getPageData, getPageTabs, getPageContent, storeNewTab, storeNewPage, storePageText };
