import React from 'react'
import { render } from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import App from './modules/App'
import Home from './modules/Home'

import Browse from './modules/Views/One/Browse'
import Edit from './modules/Views/One/Edit'
import List from './modules/Views/Many/List'
import Cards from './modules/Views/Many/Cards'

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>

      <Route path="/:entity" component={List}/>
      <Route path="/:entity/list" component={List}/>
      <Route path="/:entity/cards" component={Cards}/>

      <Route path="/:entity/new" component={Edit}/>
      <Route path="/:entity/browse" component={Browse}/>
      <Route path="/:entity/browse/:id" component={Browse}/>
      <Route path="/:entity/edit" component={Edit}/>
      <Route path="/:entity/edit/:id" component={Edit}/>
    </Route>
  </Router>
), document.getElementById('app'))

//      <IndexRoute component={Home}/>