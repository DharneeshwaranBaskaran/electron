import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import React, { useState} from "react"; 
import { useLoginContext } from "../../usercontext/UserContext";
import '../../App.css';
import Cookies from "js-cookie";
import { Helper } from "../../components/helper/helpers"; 
import Input from "../../components/registerlogin/input";
import "./loginpage.css";
function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const type = Cookies.get('type');
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const { showModal, setShowModal } = useLoginContext();
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleLogin = async (event) => {
    const selectedValue = Cookies.get('type');
    if (password == "") {
      setError1("*Enter Password");
      setError2('');
    }
    
    try {
      const response = await fetch(`http://localhost:8080/${selectedValue}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const token = await response.text();
        Cookies.set('token', token);
        setjwt(token);
        Cookies.set('dataid',Helper(token).id)  
        Cookies.set('username', username);
        navigate(`/${type}/homepage`);
        enqueueSnackbar("Login successfully", { variant: "success" });
      }
      else {
        enqueueSnackbar("Invalid Credentials");
      }
    } catch (error) {
      enqueueSnackbar("An error occurred: " + error.message, { variant: "error" });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setError('');
    setError2('');
    setUsername(value); 
  };
  const handleChange1 = (e) => {
    const value = e.target.value;
    if (username.length <1) {
      setError("*Enter Username");
    } else {
      setError('')
    }
    setError1('');
    setError2('');
    setPassword(value);
  }

  const handlebackRegister = () => {
    navigate(`/${type}/register`);
  }

  return (
    <div className="background">
      <div className="app">
        <div className="login-page">
          <h2 data-testid="Title">Login</h2>
          <div className="con"> 
          <Input type="text" placeholder="Username" value={username} onChange={handleChange} error={error} name="username"  />
          <Input type="password"  placeholder="Password" value={password}  onChange={handleChange1} error={error1} name="password" />
          </div>
          <div className="log">
            <button onClick={handleLogin} className="lob" >Login</button>
          </div>
          {(Cookies.get('type')!='delivery')&&
          
          <><div>
              <p>forgot password:</p>
              <button onClick={toggleModal} className="lob">Reset</button>
            </div><div className="errorStyle">{error2}</div><div className="log">
                <p>Don't have a account:</p><button onClick={handlebackRegister} className="lob">Register</button>
              </div></>}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;