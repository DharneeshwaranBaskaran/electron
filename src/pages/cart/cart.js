import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie";
import PaymentButton from "../../components/cart/payment";
import { Helper } from "../../components/helper/helpers"; 
import "./cart.css"
import carticon from "../../images/icons8-cart-50.png"
function Cart() {
  const { enqueueSnackbar } = useSnackbar();
  const [It, setIt] = useState([]);
  const {Balance, setBalance} = useLoginContext();
  const [Address, setAddress] = useState('');
  const [address, setaddress] = useState('');
  let Username = Cookies.get('username');
  const [Items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const type = Cookies.get("type")
  const { jwt, setjwt } = useLoginContext();
  const handlebacktohome = () => {
    navigate(`/${type}/homepage`);
    enqueueSnackbar("Redirecting to homepage", { variant: "default" });
  } 

  useEffect(() => {
    fetchData(
      [`http://localhost:8080/cart/getItems/${Username}`,`http://localhost:8080/balance/${Username}`,
      `http://localhost:8080/address/${Username}`,`http://localhost:8080/historyhome/${Username}`],
      [setItems, setBalance,setAddress,setIt]
    );
  }, []);

  const fetchData = async (urls, setDataCallbacks) => {
    try {
      const responses = await Promise.all(
        urls.map(url => fetch(url).then(response => response.json()))
      );
      responses.forEach((data, index) => {
        setDataCallbacks[index](data);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange4 = (e) => {
    setaddress(e.target.value);
  };
  const handlehistory = (key) => {
    navigate(`/${type}/${key}`);
    enqueueSnackbar(`Redirecting to ${key} page`, { variant: "default" });
  }
  const calculateTotal = (cartItems) => {
    let total = 0;
    for (const item of cartItems) {
      total += item.cost * item.count;
    }
    return total;
  };
  const removeItemFromCart = (id) => {
    fetch(`http://localhost:8080/update/${id}/${Username}`, {
      method: 'PUT'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then(() => {
        const updatedCartItems = Items.map((item) => {
          if (item.id === id) {
            return { ...item, state: true };
          }
          return item;
        });
        setItems(updatedCartItems);
        Cookies.set('cartItems', JSON.stringify(updatedCartItems));
      }).catch((error) => {
        console.error('Error updating item:', error);
      });
    window.location.reload();
    enqueueSnackbar(id + " removed from cart");
  };
  let backButton = null;
  if (Cookies.get('type') == 'buyer') {
    backButton = (<button  onClick={() => handlehistory("history")}className='purple'>Purchase History</button>
    );
  }
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleaddress = async () => {
    try {
      const response = await fetch(`http://localhost:8080/updateAddress/${Username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (response.ok) {
        const data = await response.json();
      } 
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
    window.location.reload();
  };
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div className="backgroundcols">
       {(jwt ==Cookies.get('token')&& Cookies.get('type')==Helper(jwt).type && Helper(jwt).id==Cookies.get("dataid") ) &&( 
      <>
      <div className="logout-button">
        <button onClick={handlebacktohome} className="purple">Back To Home</button>
        {backButton}
      </div>
      {Cookies.get('type') === 'buyer' && (<> 
        {It.length > 10 && (
          <h2 className="marleft">You Are A Premium User</h2>
        )}
        <div>
          <h1 className="cart-header marleft" data-testid="PRODUCTS">Cart for {Username}</h1>
          {(Address == undefined || Address == " " || Address == "") && (
            <div className="addr">
              <p className="marleft">Enter Your Address Before placing order:</p>
              <input
                className="inp"
                type="text"
                placeholder="Personal Address"
                value={address}
                onChange={handleChange4}
              /><button  className="lob marleft" onClick={handleaddress}>Confirm</button>
            </div>
          )}
        </div>
        <p className="marleft">Delivery Address:{Address}</p>
        <div data-testid="search-container">
          <input
            type="text"
            placeholder="Search Items"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar marleft"
            
          />
        </div>
        <div>
          <table className="purchase-history-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Count</th>
                <th>Cost</th>
                <th>Total Cost</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.topic}</td>
                    <td>{item.count}</td>
                    <td>${item.cost}</td>
                    <td>${item.cost * item.count}</td>
                    <td>
                      <button className="cart-button" onClick={() => removeItemFromCart(item.id)}>Remove</button>
                    </td>
                  </tr>
                ))
              ) : (<tr>
                <td colSpan="5" className="ali">
                  <div className="cartempty">  
                  <img src={carticon} alt={carticon} className='carticon'></img>
                  <h1 >Cart is empty</h1>
                  </div>
                </td>
              </tr>
              )}
            </tbody>
          </table>
          <div className="cart-total marright" >Total: $ {calculateTotal(Items)}</div>
          <div className="cart-item-count marleft" >Available Balance:${Balance}</div> 
          
          <PaymentButton/>
        </div>
      </>)}
      <p className="marleft">*$10 Extra for Non Premium Users in Express Delivery</p>
      <p className="marleft">*Products will be delivered within 24 hours in Express Delivery</p>
      <p className="marleft">*The total should be less than $50 for payment later</p>
      </>
      )}
    </div>
  )
}
export default withLogoutHandler(Cart);