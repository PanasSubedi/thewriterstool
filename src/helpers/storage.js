const modifyTabName = (tabID, newTitle) => {
  return fetch('/api/tabs/'+tabID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'title': newTitle
    })
  }).then(
    response => {
      return response.ok
    }
  )
}

const deleteTab = tabID => {
  return fetch('/api/tabs/'+tabID, {
    method: 'DELETE',
  }).then(
    response => {
      return response.ok
    }
  )
}

const deletePage = pageID => {
  return fetch('/api/pages/'+pageID, {
    method: 'DELETE',
  }).then(
    response => {
      return response.ok
    }
  )
}

const editPageTitle = (pageID, newTitle) => {
  return fetch('/api/pages/' + pageID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'title': newTitle
    })
  })
}

const storePageText = (pageID, text) => {
  return fetch('/api/pages/' + pageID, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
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


export { getPageData, getPageTabs, getPageContent,
          storeNewTab, storeNewPage, storePageText,
          editPageTitle, deletePage, deleteTab,
          modifyTabName };
