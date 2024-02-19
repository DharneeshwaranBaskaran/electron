import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from 'js-cookie';

const PaymentButton = ({ }) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [Items, setItems] = useState([]);
  const Username = Cookies.get('username');
  const [It, setIt] = useState([]);
  const { Balance, setBalance } = useLoginContext();
  const [Address, setAddress] = useState('');
  const handlehistory = (key) => {
    navigate(`/${Cookies.get("type")}/${key}`);
    enqueueSnackbar(`Redirecting to ${key} page`, { variant: "default" });
  }

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

  useEffect(() => {
    fetchData(
      [`http://localhost:8080/cart/getItems/${Username}`, `http://localhost:8080/balance/${Username}`,
      `http://localhost:8080/address/${Username}`, `http://localhost:8080/historyhome/${Username}`],
      [setItems, setBalance, setAddress, setIt]
    );
  }, []);

  const handleButtonClick = (val) => {
    if (Address == undefined || Address == " " || Address == "") {
      enqueueSnackbar("Enter your Address for Delivery");
    }
    else {
      let total = 0;
      for (const item of Items) {
        total += item.cost * item.count;
      }
      if (total > 100) {
        total = total * 9 / 10;
      }
      if (Items.length === 0)
        enqueueSnackbar("Your cart is empty", { variant: "info" });
      else if (Balance > total) {
        const newBalance = Balance - (total * 9 / 10);
        if (val === "retain") {
          setBalance(newBalance);
          fetch(`http://localhost:8080/HistoryRetainCart/${Username}`, {
            method: 'POST',
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
          }).catch((error) => {
            console.error('Error transferring data:', error);
          });
          fetch(`http://localhost:8080/updateUserBalance/${Username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBalance),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).catch((error) => {
            console.error('Error updating user balance:', error);
          });
        }
        else if (val === "express" || val === "pay") {
          if (It.length < 10 && (val === "express")) {
            newBalance = newBalance - 10;
            setBalance(newBalance);
          }
          setBalance(newBalance);
          fetch(`http://localhost:8080/api/transferToHistory/${Username}`, {
            method: 'POST',
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
          }).catch((error) => {
            console.error('Error transferring data:', error);
          });
          fetch(`http://localhost:8080/updateUserBalance/${Username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBalance),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
          }).catch((error) => {
            console.error('Error updating user balance:', error);
          });
        }
        else {
          if (total < 50) {
            fetch(`http://localhost:8080/transferToHistorypaylater/${Username}`, {
              method: 'POST'
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              }).then((data) => {
              }).catch((error) => {
                console.error('Error transferring data:', error);
              });
            navigate(`/${Cookies.get("type")}/payment`);
            enqueueSnackbar("Purchase Successful", { variant: "success" });
          }
          else {
            enqueueSnackbar("The total should be less than $50 for payment later", { variant: "warning" });
          }
        }
        navigate(`/${Cookies.get("type")}/payment`);
        enqueueSnackbar("Payment Sucessful", { variant: "success" });
        enqueueSnackbar((total * 1 / 10) + " Is the Loyalty points Added to balance");
      }
      else {
        enqueueSnackbar("Insuficient Balance", { variant: "warning" });
      }
    }
  };

  return (
    <div className="cart-buttons">
      <button className="cart-button purple" onClick={() => handleButtonClick("later")}>Buy Now pay Later</button>
      <button className="cart-button purple"  onClick={() => handleButtonClick("express")}>Express Delivery</button>
      <button className="cart-button lightpurple"  onClick={() => handleButtonClick("retain")}>Pay And Retain</button>
      <button className="cart-button lightpurple"  onClick={() => handleButtonClick("pay")}>Pay</button>
      <button onClick={() => handlehistory("add")} className="cart-button pur">Add Balance</button>
      <button onClick={() => handlehistory("address")} className="cart-button pur" >Alter Address</button>
    </div>
  );
};

export default PaymentButton;
