import React, { useState} from "react";
import { enqueueSnackbar } from "notistack";
import '../../App.css';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import "./add.css"
function Add() {
  const navigate = useNavigate();
  const [cat, setcat] = useState('');
  const [cost, setcost] = useState();
  const [description, setdescription] = useState('');
  const [rating, setrating] = useState();
  const [url, seturl] = useState('');
  const [topic, settopic] = useState('');
  const [person, setperson] = useState('');
  let Username = Cookies.get('username');
  const type = Cookies.get('type');
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState(new FormData());
  const { jwt, setjwt } = useLoginContext();
  const backtocart = (value) => {
    navigate(`/${type}/${value}`);
    enqueueSnackbar(`Back to ${value}`, { variant: "default" });
  }

  const InputField = (type, placeholder, value, onChange, style) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );

  const addData = async (key) => {
    const response = await fetch(`http://localhost:8080/api/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ cat, cost, description, rating, url, topic, person, seller: Username }),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Data Added Sucessfully", { variant: "success" });
      navigate(`/${type}/homepage`);
      const response1 = await fetch('http://localhost:8080/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cat, cost, description, rating, url, topic, person, seller: Username }),
        credentials: 'include',
      });
    }
    else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setFormData(formData);
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target.result;
        Papa.parse(csvContent, {
          complete: (result) => {
            setCsvData(result.data);
          },
          header: true,
        });
      };
      reader.readAsText(file);
    } else {
      enqueueSnackbar("Please select a CSV file first", { variant: "error" });
    }
  };

  const uploadCsvToBackend = async () => {
    if (csvData.length > 0) {
      fetch("http://localhost:8080/api/up-csv", {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
        .then(async response => {
          if (response.ok) {
            enqueueSnackbar("CSV data uploaded successfully", { variant: "success" });
            setCsvData([]);
          } else {
            enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
            const errorData = await response.text();
            enqueueSnackbar(errorData, { variant: "error" });
          }
        })
        .catch(error => {
          enqueueSnackbar(error, { variant: "error" });
        });
    }
  };
  
  return (
    <div className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
        <>
      <div className="logout-button">
        <button onClick={() => backtocart("cart")} className="purple">Cart</button>
        <button onClick={() => backtocart("homepage")} className="lightpurple">Back To Home</button>
      </div>
        <div className='app'>
          <div className="login-page back" >
            <h2 data-testid="PRODUCT">LAUNCH PRODUCT</h2>
            <div className="con">
              {InputField("text", "category", cat, (e) => setcat(e.target.value))}
              {InputField("integer", "cost", cost, (e) => setcost(e.target.value))}
              {InputField("text", "Description", description, (e) => setdescription(e.target.value))}
              {InputField("double", "Rating", rating, (e) => setrating(e.target.value))}
              {InputField("text", "Topic", topic, (e) => settopic(e.target.value))}
              {InputField("text", "Url", url, (e) => seturl(e.target.value))}
              {InputField("text", "person", person, (e) => setperson(e.target.value))}
            </div>
            <button className="lob marright" onClick={() => addData("adddata")} >Launch Product</button>
            <button className="lob marleft" onClick={() => addData("adddatadraft")}>Add To Draft</button>
            <div>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="col" /><br />
              <button onClick={uploadCsvToBackend} className="lob">Upload CSV to Backend</button><br />
            </div>
          </div>
        </div>
      <div className="purchase-history-table martop" >
        <table>
          <thead>
            <tr>
              {csvData.length > 0 && Object.keys(csvData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>
      )}
    </div>
  );
}
export default withLogoutHandler(Add);
