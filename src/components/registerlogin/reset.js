
import { useSnackbar } from "notistack";
import React, { useState} from "react";
import '../../App.css';
import { useLoginContext} from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import  Input  from "./input";
function Reset() {

  const [username1, setUsername1] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { showModal, setShowModal } = useLoginContext();
  const handlemail = async (event) => {
    if (username1 == "" || email == "") {
      enqueueSnackbar("Enter the Required data");
    }
    const selectedValue = Cookies.get('type');
    try {
      const response = await fetch(`http://localhost:8080/api/pass/${selectedValue}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username: username1, email }),
        credentials: 'include',
      });
      if (response.ok) {
        setShowModal(!showModal);
        enqueueSnackbar("Username and password sent to email", { variant: "success" });
      }
      else {
        enqueueSnackbar("Invalid Credentials");
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  }
  
  const handleChangepass = (event) => {
    const name = event.target.value;
      setUsername1(name);
  };

  const handleChange = (event) => {
    const name = event.target.value;
      setEmail(name);
  };
  return (
    <div className="background">
    <div className="app">
      <div className="login-page">
      {showModal && (
          <>
        <h2>Enter Username and Email:</h2>
        <div className="con">
        <Input type="text"  placeholder="Username" value={username1}  onChange={handleChangepass} />
        <Input type="text"  placeholder="Email" value={email}  onChange={handleChange} />
          <button type="submit" className="lob" onClick={handlemail}>Submit</button>
        </div>
        </>
        )}
      </div>
      </div>
      </div>
   );
} 
export default Reset;
