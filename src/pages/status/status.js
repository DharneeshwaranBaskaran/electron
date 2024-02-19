
import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import Statustable from "../../components/statustable/statustable";
const { ipcRenderer } = window.require('electron');
const Status = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const [Data, setData] = useState([]);
  const [selectValues, setSelectValues] = useState([]);
  const handlehome = () => {
    navigate(`/${Cookies.get("type")}/homepage`);
  }
  const handleSelectChange = (index, value) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = value;
    setSelectValues(newSelectValues);
  };
  useEffect(() => {
    ipcRenderer.send('fetchData', [`http://localhost:8080/status/${Username}`]);
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
            <button onClick={handlehome} className="purple">Home</button>
          </div>
          <Statustable
            data={Data}
            handleSelectChange={handleSelectChange}
            handleEdit={handleEdit} 
            order="Order Placed"
            shipping="Shipping"
          />
        </>
      )}
    </div>
  );
}

export default withLogoutHandler(Status); 