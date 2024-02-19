import React, { useState,useEffect} from "react";
import { useSnackbar } from "notistack";
import '../../App.css';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext"; 
import Cookies from "js-cookie";
import { Helper } from "../../components/helper/helpers"; 
import "./payment.css"
import FeatureFlags from "../../featureflag/featureflag";
function Payment() {
  const navigate = useNavigate();
  let Username = Cookies.get('username');
  const {Balance, setBalance} = useLoginContext();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [type, setType] = useState('');
  const typeo = Cookies.get('type');
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState(new FormData());
  
  const { jwt, setjwt } = useLoginContext();
  const handlebacktohomefrompay = () => {
    enqueueSnackbar("Redirecting to homepage", { variant: "default" });
    navigate(`/${typeo}/homepage`);
  }
  useEffect(() => {
    fetchData([`http://localhost:8080/balance/${Username}`],[ setBalance]);
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

  const handleRegister = async (event) => {
    let endpoint = "";
    if (Cookies.get("type") === "seller") {
      endpoint = "http://localhost:8080/register/access";
    } else {
      endpoint = "http://localhost:8080/register/companyaccess";
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, type, provider: Username }),
      credentials: 'include'
    });
    if (response.ok) {
      enqueueSnackbar("Access Given Successfully", { variant: "success" });
      navigate(`/${typeo}/homepage`);
    } else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
      enqueueSnackbar("Registration Failed", { variant: "error" });
    }
  };
  const handleChange3 = (e) => {
    setEmail(e.target.value);
  }
  const handleChange = (e) => {
    setUsername(e.target.value);
  }
  const handleChange2 = (e) => {
    setType(e.target.value);
  }
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
      fetch("http://localhost:8080/api/upload-csv/company", {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }).then(async response => {
          if (response.ok) {
            enqueueSnackbar("CSV data uploaded successfully", { variant: "success" });
            setCsvData([]);
          } else {
            enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
            const errorData = await response.text();
            enqueueSnackbar(errorData, { variant: "error" });
          }
        }).catch(error => {
          console.error(error);
        });
    }
  };
  const InputField = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
  return (
    <div className="backgroundhistory">
      {(jwt ==Cookies.get('token')&& Cookies.get('type')==Helper(jwt).type && Helper(jwt).id==Cookies.get("dataid") ) &&( 
      <>
      <div className="logout-button">
        <button onClick={handlebacktohomefrompay} className="purple">Back To Home </button>
      </div>
      
      {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (
        <div className="app">
          <div className="login-page" >
            <h2 data-testid="PRODUCTS">Give Access</h2> {Username}
            {InputField("text", "Username", username, handleChange)}
            {InputField("text", "Email", email, handleChange3)}
            {InputField("text", "Type", type, handleChange2)}
            <button className="lob" onClick={handleRegister}>
              Give Access</button>
              {FeatureFlags.iscsvaccess() && (<>
              <div>
                <input type="file" accept=".csv" onChange={handleFileUpload} className="color"/>
                <br />
                <button onClick={uploadCsvToBackend} className="lob">Upload CSV to Backend</button>
                <br />
              </div>
            </> )}
          </div>
        </div>
      )}
      <div className="p-history-table his" >
        <table>
          <thead>
            <tr>
              {csvData.length > 0 &&
                Object.keys(csvData[0]).map((header, index) => (
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
      </div></>
      )}
    </div>
  )
}
export default withLogoutHandler(Payment);
