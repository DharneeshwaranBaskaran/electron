import React, { useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import CustomCard from "../../components/cards/customcard";
import { useNavigate } from 'react-router-dom';
import DissatisfiedSymbol from '../../components/DissatisfiedSymbol/DissatisfiedSymbol';
import Autosuggest from 'react-autosuggest';
import { act } from '@testing-library/react'; 
import Cookies from "js-cookie";
import '../../App.css'; 
import './start.css'
import { enqueueSnackbar } from "notistack";
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';

function Start() {

//Initialisation
  const navigate = useNavigate();
  const [data, setData] = useState([]);

// Search-related state

  const [value, setValue] = useState(''); 
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

//Event handling

  const handletomenex = (id) => {
    enqueueSnackbar("Register Initially and login to view products");
    setTimeout(() => {
      Cookies.set('type', "seller"); 
    navigate(`/buyer/seller`);
    window.location.reload();
    }, 1500);
  };
  const RegistrationOption = ({ type, header, handleRegister, handleLogin }) => (
    <div className="individual-registration">
      <h4>{header}</h4>
      <button className="lob"  data-testid="login-button" onClick={() => handleLogin(type)}>Login</button>
      {handleRegister && <button className="lob" onClick={() => handleRegister(type)}>Register</button>}
    </div>
  );

  const handleAuthentication = (key, action) => {
    const types = { 0: 'company', 1: 'seller', 2: 'buyer', 3: 'access', 4: 'companyaccess' };
    const type = types[key];
    if (action === 'login') {
      Cookies.set('type', type);
      navigate(`/${type}/login`); 
    } else if (action === 'register') {
      Cookies.set('type', type);
      navigate(`/${type}/register`);
    } 
    window.location.reload();
  };

  const handletologin = (key) => {
    handleAuthentication(key, 'login');
  };
  const handleLogging=()=>{ 
    Cookies.set('type','delivery');
    navigate(`/delivery/login`); 
  }

  const handletoregister = (key) => {
    handleAuthentication(key, 'register');
  };
 
//mounting phase
//fetches data from an API and stores it in its state
useEffect(() => {
  act(() => {
    fetch('http://localhost:8080/api/combodataseller')
      .then(response => {
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        console.error('Error fetching history items:', error);
      });
  });
}, []);

  const uniqueItems = Array.isArray(data)
    ? data.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic))
    : [];

  const onInputChange = (event, { newValue }) => {
    setValue(newValue);
  };

  const suggestions = uniqueItems.map(item => item.topic);
  
  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = (value || '').toLowerCase();

      //updating phase
    setSuggestionsList(getSuggestions(inputValue));
  };

  const filteredItems = uniqueItems.filter((item) => {
    const inputValue = (value || '').toLowerCase();
    return item.topic.toLowerCase().includes(inputValue);
  });

  const onSuggestionsClearRequested = () => {
    setSuggestionsList([]);
  };

  const getSuggestions = (value) => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => suggestion.toLowerCase().slice(0, inputLength) === inputValue);
  };

  const currentItems = filteredItems.slice(((currentPage * itemsPerPage) - itemsPerPage), currentPage * itemsPerPage);
  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); 
  };

  return (
    <div className="background">
       <div className="logout-button log">
      </div>
      <h2 className="alignheader" data-testid="PRODUCTS:"> PRODUCTS: </h2>
      <div className="search-container" data-testid="search-container"> 
        <Autosuggest
          suggestions={suggestionsList}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={suggestion => suggestion}
          renderSuggestion={suggestion => (
            <div data-testid="Search Products">{suggestion}</div>
          )}
          inputProps={{
            placeholder: "Search Products",
            value: value,
            onChange: onInputChange,
          }}
        />
      </div>
      <div className='class-contain' data-testid="custom-card">
        {(currentItems).length !== 0 ? (
          <>
            {(currentItems).map(item => (
              <CustomCard
                key={item.id}
                item={item}
                handleView={(itemName) => handletomenex(itemName)}
              />
            ))}
          </>
        ) : (
          <>
            <DissatisfiedSymbol />
            <h2 data-testid="no products">No products Found</h2>
          </>
        )}
      </div>
      <div className="pagination" data-testid="pagination-button">
        <ul> 
          
          {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
            <li
              key={i}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </li>
          ))}
        </ul>
      </div><br />
      <div className="video-container" data-testid="video-container">
        <ReactPlayer ref={null} url={VIDEO_PATH} controls={true} />
      </div>
      <div className="alignheader">
        <h2>Want To Sell Your Product In Our Website: <br />
          <RegistrationOption type={1} header={"As Individual:"} handleRegister={handletoregister} handleLogin={handletologin} />
          <RegistrationOption type={0} header={"As company:"} handleRegister={handletoregister} handleLogin={handletologin} />
          <br/>Delivery 
          <div className="individual-registration">
          <button className="lob" onClick={handleLogging}>Login</button>
          </div>
        </h2>
      </div>
    </div>
  )
}
export default Start;
