import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import './styles.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Offer from './components/pages/Offer';
import Device from './components/pages/Device';
import Procedure from './components/pages/Procedure';

class App extends React.Component {
    render() {
        console.log('env url:', process.env.PUBLIC_URL);
        return (
            <>
                <Header /> 

                <div className="main">
                    <Sidebar />

                    <article>
                        <Router basename={process.env.PUBLIC_URL}>
                            <Switch>
                                <Route path="/offer/:id" component={Offer} />
                                <Route path="/devices/:id" component={Device} />
                                <Route path="/procedure/:id" component={(props) => (<Procedure timestamp={new Date().toString()} {...props} />)} />
                                <Route component={() => (<div>404 Not found </div>)} />
                            </Switch>
                        </Router>
                    </article>
                </div>
            </>
        )
    };
}

ReactDOM.render(<App />, document.getElementById('root'));