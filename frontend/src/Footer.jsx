import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div className="container">
                <p>&copy; <span id="current-year">{new Date().getFullYear()}</span> Seth Kipchumba. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
