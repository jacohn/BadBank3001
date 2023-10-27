import React from 'react';
import PropTypes from 'prop-types'; // for type checking



const defaultUserContext={
  users: [],
  loggedInUser: null
};

export const UserContext = React.createContext(defaultUserContext);

function Card(props){
  return (
    <div className={"card " + props.bgcolor + " mb-3"} style={{maxWidth: "18rem"}}>
      <div className={"card-header " + props.txtcolor}>{props.header}</div>
      {props.title && <h5 className="card-title">{props.title}</h5>}
      {props.text && <p className="card-text">{props.text}</p>}
      <div className="card-body">
        {props.body}
      </div>
      {props.status && <div id="createStatus">{props.status}</div>}
    </div>      
  );
}

// defining proptypes for the card component
Card.propTypes={
  bgcolor: PropTypes.string,
  txtcolor: PropTypes.string,
  header: PropTypes.string.isRequired,
  title: PropTypes.string,
  text: PropTypes.string,
  body: PropTypes.node.isRequired,
  status: PropTypes.string
};

export default Card;