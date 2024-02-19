import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom'; 
import "./homcom.css"; 
function Header() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const actionOptions = ["Menu", "Remove", "Add", "Access","Status","Logout"];
    const [forpic, setforpic] = useState('');
    const [cart, setcart] = useState([]);
    const username = Cookies.get('username');
    let typeo = Cookies.get('type');


    const fetchData = async (url, setDataCallback) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
            } const data = await response.json();
            setDataCallback(data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        }
    };
    useEffect(() => {
        fetchData(`http://localhost:8080/cart/getItems/${username}`, setcart);
    }, []);
    useEffect(() => {
        fetch(`http://localhost:8080/user/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching user data: ${response.statusText}`);
                } return response.json();
            }).then((data) => {
                setforpic(data[0].profilepic);
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);
    
    const handleActionChange = (event) => {
        if (event.target.value == "Remove")
            navigate(`/${typeo}/history`);
        else if (event.target.value == "Add") {
            navigate(`/${typeo}/add`);
        } else if (event.target.value == "Access") {
            navigate(`/${typeo}/payment`);
        } else if (event.target.value == "Cart") {
            navigate(`/${typeo}/cart`); 
        }else if (event.target.value == "Status") {
            navigate(`/${typeo}/status`); 
        } else {
            const broadcastChannel = new BroadcastChannel('logoutChannel');
            broadcastChannel.postMessage('logout');
            navigate("/start");
            const cookies = Cookies.get();
            for (const cookie in cookies) {
                Cookies.remove(cookie);
            }
            window.location.reload();
            enqueueSnackbar("Logout Successful");
        }
    };
    const handleChange = (event) => {
        Cookies.set("weekend", event.target.value === "No" ? "No" : "Yes");
    }
    return (
        <div className="logout-button">
            
            {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (
                <select onChange={handleActionChange} className='purple'>
                    {actionOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
           
        </div>
    );
}

export default Header;  
