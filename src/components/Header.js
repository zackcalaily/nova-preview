import React from 'react';

import logo from '../images/logo.png';
import bookmarks from '../images/bookmarks.svg';

function Header(props) {
    return (
        <header>
            <div className="topbar">
                <div className="logo">
                    <img src={logo} alt="Nova" />
                </div>

                <div className="attributes">
                    <div className="font-resize">
                        <small>A</small> A
                    </div>

                    <div className="brand-toggle">
                        <span>Brand:</span>
                        <div className="btn-group">
                            <button type="button" className="btn btn-secondary active">Rogers</button>
                            <button type="button" className="btn btn-secondary">Fido</button>
                            <button type="button" className="btn btn-secondary">KM</button>
                        </div>
                    </div>

                    <div className="language">
                        Francais
                    </div>

                    <div>
                        Welcome, Zack Calaily
                        <i className="fa fa-chevron-down ml-1"></i>
                    </div>
                </div>
            </div>

            <div className="search">
                <div className="input-group">
                    <input type="text" placeholder="Search for specific terms, questions, Document IDs, etc." className="form-control" />
                    
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-secondary">
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
                </div>

                <div className="bookmarks">
                    <img src={bookmarks} alt="bookmarks" width="30" height="30" />
                </div>
            </div>            
        </header>
    );
} 

export default Header;