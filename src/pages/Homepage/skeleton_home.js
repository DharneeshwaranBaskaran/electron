import React from "react";
import { Card } from "@mui/material";
import Cookies from 'js-cookie';
import '../../App.css';

const Skeleton = (item) => {
    return (
        <div className="backgroundhome"> 
            {(!Cookies.get('username'))&&(
                <><div className="app">
                <div className="login-page">
                </div>
              </div></>
            )}
           
                <div className="logout-button">
                    <select
                       > </select>
                </div>
                <h2 className="marleft">SOLD HISTORY:</h2>
                <div className="search-container">
                    <select
                      ></select>
                </div>
                <div key={item.id} className='selclass'>
                    <Card>
                        <div className="carh"></div>
                    </Card>
                </div>
        </div>
    );
};

export default Skeleton;
