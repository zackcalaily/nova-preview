import React from 'react';

import home from '../images/home_selected.png';
import tv from '../images/tv.png';
import homeMonitoring from '../images/homeMonitoring.png';
import homePhone from '../images/homePhone.png';
import internet from '../images/internet.png';
import wireless from '../images/wireless.png';

function Sidebar(props) {
    return (
        <div className="sidebar">
            <ul>
                <li>
                    <div className="icon"><i className="fa fa-chevron-left"></i></div>
                    <span>Collapse Menu</span>
                </li>

                <li className="active">
                    <div className="icon"><img src={home} alt="icon" width="30" height="30" /></div>
                    <span>Dashboard</span>
                </li>
              
                <li>
                    <div className="icon"><img src={tv} alt="icon" width="30" height="30" /></div>
                    <span>Digital TV</span>
                </li>

                <li>
                    <div className="icon"><img src={homeMonitoring} alt="icon" width="30" height="30" /></div>
                    <span>Home Monitoring</span>
                </li>

                <li>
                    <div className="icon"><img src={homePhone} alt="icon" width="30" height="30" /></div>
                    <span>Home Phone</span>
                </li>
              
                <li>
                    <div className="icon"><img src={tv} alt="icon" width="30" height="30" /></div>
                    <span>Ignite TV</span>
                </li>
              
                <li>
                    <div className="icon"><img src={internet} alt="icon" width="30" height="30" /></div>
                    <span>Internet</span>
                </li>
              
                <li>
                    <div className="icon"><img src={wireless} alt="icon" width="30" height="30" /></div>
                    <span>Wireless</span>
                </li>
            </ul>
        </div>
    );
}

export default Sidebar;