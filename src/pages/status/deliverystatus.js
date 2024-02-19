
import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import DeliveryStatustable from "../../components/statustable/deliverystatustable"
const { ipcRenderer } = window.require('electron');
const DeliveryStatus = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const [Data, setData] = useState([]);
  const [selectValues, setSelectValues] = useState([]);
  const handlehome = () => {
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
  const handleSelectChange = (index, value) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = value;
    setSelectValues(newSelectValues);
  };
  useEffect(() => {
    ipcRenderer.send('fetchData', ['http://localhost:8080/deliverystatus']);
    ipcRenderer.on('setData', (event, { index, data }) => {
        setData(data);
    });
    return () => {
      ipcRenderer.removeAllListeners('setData');
    };
  }, []);

  const handleEdit = async (id, index) => {
    ipcRenderer.send('handleEditStatus', { id, status: selectValues[index] }); 
    enqueueSnackbar("Updated Sucessfully");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  
  return (
    <div className="backgroundcol">
      {jwt == Cookies.get('token') && (
        <>
          <div className="logout-button">
            <button onClick={handlehome} className="purple">Logout</button>
          </div>
          <DeliveryStatustable
            data={Data}
            handleSelectChange={handleSelectChange}
            handleEdit={handleEdit}
            
          />
        </>
      )}
    </div>
  );
}

export default withLogoutHandler(DeliveryStatus); 