function Withdraw(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');  

  return (
    <Card
      bgcolor="success"
      header="Withdraw"
      status={status}
      body={show ? 
        <WithdrawForm setShow={setShow} setStatus={setStatus}/> :
        <WithdrawMsg setShow={setShow} setStatus={setStatus}/>}
    />
  )
}

function WithdrawMsg(props){
  return(<div>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => {
        props.setShow(true);
        props.setStatus('');
      }}>
        Withdraw again
    </button>
  </div>);
}

function WithdrawForm(props){
  const [email, setEmail]   = React.useState('');
  const [amount, setAmount] = React.useState('');

  function handle(){
    //client side validation
    if(!email || !amount || Number(amount) <=0){
      props.setStatus('Email and a positive amount are required.');
      return;
    }

    const data = {email, amount: -Math.abs(amount)}; //ensures negative amount

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
      };


    fetch(`/account/update`, requestOptions)
    .then(response => response.json())
    .then(data => {
        if(data.success){
          props.setStatus(`Withdrew $${amount} successfully.`);
          props.setShow(false); 
        } else {
          props.setStatus('Withdrawal failed. '+ data.message);
        }
      })
      .catch(error => {
        props.setStatus('Error making withdrawal. Please try again.')
      });
    }


  return(<div>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Amount<br/>
    <input type="number" 
      className="form-control" 
      placeholder="Enter amount" 
      value={amount} 
      onChange={e => setAmount(e.currentTarget.value)}/><br/>

    <button type="submit" 
      className="btn btn-light" 
      onClick={handle}>
        Withdraw
    </button>

  </div>);
}

export default Withdraw;
