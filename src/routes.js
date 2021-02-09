import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Chapter = lazy(() => import('./pages/Chapter'));

const Routes = () => {
  return (
    <Suspense fallback={<p>Loading</p>}>
      <Router>
        <Switch>
          <Route exact path="/chapter" component={Chapter} />
          <Route path="/" component={() => (<p>404</p>)} />
        </Switch>
      </Router>
    </Suspense>
  )
}

export default Routes;
