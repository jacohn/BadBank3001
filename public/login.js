import { UserContext } from './context.js';

function Login(){
  const [show, setShow]     = React.useState(true);
  const [status, setStatus] = React.useState('');
  const ctx = React.useContext(UserContext);
  
  
  return (
    <Card
      bgcolor="secondary"
      header="Login"
      status={status}
      body={show ? 
        <LoginForm setShow={setShow} setStatus={setStatus}/> :
        <LoginMsg setShow={setShow} setStatus={setStatus}/>}
    />
  ) 
}

function LoginMsg(props){
  return(<div>
    <h5>Success</h5>
    <button type="submit" 
      className="btn btn-light" 
      onClick={() => props.setShow(true)}>
        Authenticate again
    </button>
  </div>);
}

function LoginForm(props){
  const [email, setEmail]       = React.useState('');
  const [password, setPassword] = React.useState('');

  function handle(){
    // CLient-side validation
    if(!email || !password){
      props.setStatus('Both email and password are required.');
      return;
    }

    const data = {email, password};
    const requestOptions = {
      method:'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    };

    fetch('/account/login', requestOptions)
    .then(response => response.json())
    .then(data => {
        if(data.success){
          props.setStatus('Logged in successfully.');
          props.setShow(false);
        } else {
          props.setStatus('Error during login. Please try again.');
        });
      }
      


  return (<div>

    Email<br/>
    <input type="input" 
      className="form-control" 
      placeholder="Enter email" 
      value={email} 
      onChange={e => setEmail(e.currentTarget.value)}/><br/>

    Password<br/>
    <input type="password" 
      className="form-control" 
      placeholder="Enter password" 
      value={password} 
      onChange={e => setPassword(e.currentTarget.value)}/><br/>

    <button type="submit" className="btn btn-light" onClick={handle}>Login</button>
   
  </div>);
}