function Balance(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      bgcolor="info"
      header="Balance"
      status={status}
      body={show ?
        <BalanceForm setShow={setShow} setStatus={setStatus}/> :
        <BalanceMsg setShow={setShow} setStatus={setStatus}/>}
    />
  )

}

function BalanceMsg(props){
  return(<div>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Check balance again
    </button>
  </div>);
}

function BalanceForm(props){
  const [email, setEmail]   = React.useState('');
  const [balance, setBalance] = React.useState('');  

  function handle(){
    // client-side validation
    if(!email){
      props.setStatus('Email is required.');
      return;
    }

    const data = {email};
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    fetch(`/account/findOne`, requestOptions)
    .then(response => response.json())
    .then(data => {
        if(data.success){
            props.setStatus(`Balance: $${data.balance}`);
            props.setShow(false);
            setBalance(data.balance);
        } else {
            props.setStatus('Failed to retrieve balance. ' + data.message);
        }
    })
    .catch(error => {
      props.setStatus('Error checking balance. Please try again.');
    });
  }

  return (<div>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>
        Check Balance
    </button>

  </div>);
}

export default Balance;