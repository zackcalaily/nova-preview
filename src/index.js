import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './styles.css';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Offer from './components/pages/Offer';

class App extends React.Component {
    render() {
        return (
            <>
                <Header /> 

                <div className="main">
                    <Sidebar />

                    <article>
                        <Router>
                            <Route path="/offer/:id" component={Offer} />
                        </Router>
                    </article>
                </div>
            </>
        )
    };
}

ReactDOM.render(<App />, document.getElementById('root'));