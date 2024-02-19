import React from 'react';
import Disatified from "../../images/disatisfied.jpg"
import "./symbol.css"; 

class DissatisfiedSymbol extends React.Component {
  render() {
    return (
        <img src={Disatified} alt={Disatified} className="dissatisfied-image" />
    );
  }
}

export default DissatisfiedSymbol;
