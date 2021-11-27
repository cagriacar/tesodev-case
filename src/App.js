import LandingPage from "./components/LandingPage";
import SearchList from "./components/SearchList";
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/search-list">
            <SearchList itemsPerPage={6} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
