import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [indicatorStyle, setIndicatorStyle] = useState({});

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleMouseOver = (event) => {
        const itemHeight = event.target.offsetHeight;
        const offsetTop = event.target.offsetTop;
        setIndicatorStyle({
            top: `${offsetTop}px`,
            height: `${itemHeight}px`
        });
    };

    return (
        <div className="sidebar-wrapper">
            <div className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
                <ul>
                    <div className="profile">
                        <img src="https://i.pinimg.com/originals/6d/1f/20/6d1f2038bcf52a4cc496489fcd2139a6.jpg" alt="profile pic" />
                        <span>Username</span>
                    </div>

                    <div className="indicator" id="indicator" style={indicatorStyle}></div>
                    <li onMouseOver={handleMouseOver}><i className="icon"><i className="fa-solid fa-house"></i></i><span>Home</span></li>
                    <li onMouseOver={handleMouseOver}><i className="icon"><i className="fa-solid fa-envelope"></i></i><span>Emails</span></li>
                    <li onMouseOver={handleMouseOver}><i className="icon"><i className="fa-solid fa-chart-column"></i></i><span>Charts</span></li>
                    <li onMouseOver={handleMouseOver}><i className="icon"><i className="fa-solid fa-gem"></i></i><span>Premium</span></li>
                    <li onMouseOver={handleMouseOver}><i className="icon"><i className="fa-solid fa-right-from-bracket"></i></i><span>Logout</span></li>
                </ul>
            </div>
            <button className="toggle-btn" id="toggleBtn" onClick={toggleSidebar}>
                <i className={`fa-solid ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
            </button>
        </div>
    );
};

export default Sidebar;
