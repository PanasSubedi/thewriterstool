import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));

const Routes = () => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Router>
        <Switch>
          <Route exact path="/ui/:id" component={Home} />
          <Route exact path="/ui" component={Home} />
          <Route exact path="/"><Redirect to="/ui" /></Route>
        </Switch>
      </Router>
    </Suspense>
  )
}

export default Routes;
