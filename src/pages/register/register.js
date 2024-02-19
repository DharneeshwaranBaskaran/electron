import React, { useState } from "react";
import '../../App.css';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import Input from "../../components/registerlogin/input"; 
import "./register.css"
function RegisterPage() {
  const type = Cookies.get('type');
  const navigate = useNavigate();
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConPassword, setValidConPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [comaddress, setcomAddress] = useState('');
  const [company, setCompany] = useState('');
  const [num, setnum] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');
  const [error4, setError4] = useState('');
  const [error5, setError5] = useState('');
  const [error6, setError6] = useState('');
  const [isname, setIsname] = useState(false)
  const [isnum, setisnum] = useState(false);
  const [iscompany, setiscompany] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isPassword, setIspassword] = useState(false)
  const [isconPassword, setIsconpassword] = useState(false)
  const [isAddress, setIsAddress] = useState(false);
  const [err, setErr] = useState('');
  

  const handleRegister = async (event) => {
    if (!username || !password || !conpassword || !email) {
      enqueueSnackbar("Please fill in all required fields", { variant: "error" });
      return;
    }
    if (password !== conpassword) {
      setError2('Passwords do not match');
      return;
    }
    const selectedValue = Cookies.get('type');
    let data = {};
    switch (selectedValue) {
      case "seller":
        data = { name, num, company, username, password, conpassword, email, address, comaddress };
        break;
      default:
        data = { num, company, username, password, conpassword, email, comaddress, website };
        break;
    }
    const response = await fetch(`http://localhost:8080/register/${selectedValue}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Registration Successful", { variant: "success" });
      navigate(`/${type}/login`);
    } else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
      enqueueSnackbar("Registration Failed", { variant: "error" });
    }
  };
  const handleInputChange = (e, setValue, setValid, minLength, errorMessage, setInvalidFlag, setError,typ) => {
    const value = e.target.value;
    setValue(value);
    setValid(value.length >= minLength);
    if (value.length >= minLength) {
      setError('');
      setInvalidFlag(false);
    }else if(typ="conpassword" && password!=conpassword){
      setError2("*passwords don't match");
    } else {
      setInvalidFlag(true);
      setError(errorMessage);
    } 
  };
 
  const handleChange = (e) => {
    handleInputChange(e, setUsername, setValidUsername, 6, '*Username should contain a minimum of 6 characters', setIsClicked, setError,"username");
  };
  const handleChange1 = (e) => {
    handleInputChange(e, setPassword, setValidPassword, 6, '*Passwords should contain a minimum of 6 characters', setIspassword, setError1,"password");
  };
  const handleChange2 = (e) => {
    handleInputChange(e, setConPassword, setValidConPassword, 6, '*Passwords should contain a minimum of 6 characters', setIsconpassword, setError2,"conpassword");
  };
  const handleChange3 = (e) => {
    handleInputChange(e, setEmail, setValidEmail, 6, '*Email should contain a minimum of 6 characters', setIsAddress, setError3);
  };
  const handleChange4 = (e) => {
    handleInputChange(e, setAddress, setValidAddress, 6, '*Email should contain a minimum of 6 characters or Enter a valid Email', setIsAddress,setErr);
  };
  const handleChange5 = (e) => {
    handleInputChange(e, setname, () => true, 6, '*Name should contain a minimum of 6 characters', setIsname, setError4);
  };
  const handleChange6 = (e) => {
    handleInputChange(e, setnum, () => true, 10, '*Number should contain a minimum of 10 characters', setisnum, setError5);
  };
  const handleChange7 = (e) => {
    handleInputChange(e, setCompany, () => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };
  const handleChange8 = (e) => {
    handleInputChange(e, setcomAddress, () => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };
  const handleChange9 = (e) => {
    handleInputChange(e, setWebsite, () => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };

  const redirectinglogin = () => {
    navigate(`/${type}/login`);
  }

  const generateInputStyle = (isInvalid) => ({
    outline: isInvalid ? '1px solid red' : '1px solid black',
  });

  const inputStyle = generateInputStyle(isClicked);
  const inputStyle1 = generateInputStyle(isPassword);
  const inputStyle2 = generateInputStyle(isconPassword);
  const inputStyle3 = generateInputStyle(isAddress);
  const inputStyle4 = generateInputStyle(isname);
  const inputStyle5 = generateInputStyle(isnum);
  const inputStyle6 = generateInputStyle(iscompany);
  return (
    <div className="background">
      <div className="padding"></div>
      <div className="app" >
        <div className="login-page"  >
          <h2 data-testid="Title">Register</h2>
          {Cookies.get('type')}
          <div className="con" data-text="form">
            {type === 'seller' && <Input type="text" placeholder="Name" value={name} onChange={handleChange5} style={inputStyle4} />}
            <div className="errorStyle">{error4}</div>
            {type !== 'buyer' && <Input type="text" placeholder="Contact Number" value={num} onChange={handleChange6} style={inputStyle5} />}
            <div className="errorStyle">{error5}</div>
            {type !== 'buyer' && <Input type="text" placeholder="Company" value={company} onChange={handleChange7} style={inputStyle6} />}
            <div className="errorStyle">{error6}</div>
            <Input type="text" placeholder="Username" value={username} onChange={handleChange} style={inputStyle} />
            <div className="errorStyle">{error}</div>
            <Input type="password" placeholder="Password" value={password} onChange={handleChange1} style={inputStyle1} />
            <div className="errorStyle">{error1}</div>
            <Input type="password" placeholder="Confirm Password" value={conpassword} onChange={handleChange2} style={inputStyle2} />
            <div className="errorStyle">{error2}</div>
            <Input type="text" placeholder="Email" value={email} onChange={handleChange3} style={inputStyle3} />
            <div className="errorStyle">{error3}</div>
            {type !== 'company' && <Input type="text" placeholder="Personal Address" value={address} onChange={handleChange4} />}
            {type !== 'buyer' && <Input type="text" placeholder="Company Address" value={comaddress} onChange={handleChange8} />}
            {type === 'company' && <Input type="text" placeholder="Website" value={website} onChange={handleChange9} />}
          </div>
          <button onClick={handleRegister} className="lob"> Register</button>
          <div className="log">
            <p>already have a account:</p>
            <button onClick={redirectinglogin} className="lob"> Login </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;