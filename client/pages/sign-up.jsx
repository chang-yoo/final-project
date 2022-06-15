import React from 'react';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      phone: null,
      email: '',
      box: 'off',
      error: 'off'
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.reset = this.reset.bind(this);
    this.closeBox = this.closeBox.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch('/api/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
      .then(res => res.json())
      .then(result => {
        const { error } = result;
        if (error) {
          this.setState({ error: 'on' });
        } else {
          this.setState({ box: 'on' });
        }
      });
  }

  reset() {
    this.setState({
      username: '',
      password: '',
      phone: null,
      email: ''
    });
  }

  closeBox() {
    this.setState({ error: 'off' });
  }

  render() {
    let confirm = 'hidden';
    let err = 'hidden';
    if (this.state.box === 'on') {
      confirm = '';
    }
    if (this.state.error === 'on') {
      err = '';
    }
    return (
      <div className="list-background">
        <div>
          <h1>Sign Up</h1>
        </div>
        <div className="full-column">
          <div className="width-60 auto">
            <div className="row center">
              <form onSubmit={this.handleSubmit}>
                <div className="rows space-between margin-vert-2rem">
                  <div className="margin-vert-2rem">
                    <label>
                      <h2>
                        Username
                      </h2>
                    </label>
                    <input
                      required
                      id="username"
                      type="text"
                      name="username"
                      onChange={this.handleChange}
                      className="username"
                    />
                    <label>
                      <h2>
                        Password
                      </h2>
                    </label>
                    <input
                      required
                      id="password"
                      type="password"
                      name="password"
                      onChange={this.handleChange}
                      className="password"
                    />
                    <p className="sign-in-no-account">
                      Already have an account?
                    </p>
                    <a href="#sign-in" className="sign-in-no-account">
                      Sign In
                    </a>
                  </div>
                  <div className="margin-vert-2rem">
                    <div>
                      <label>
                        <h2>
                          Phone
                        </h2>
                      </label>
                      <input
                        required
                        id="phone"
                        type="tel"
                        name="phone"
                        onChange={this.handleChange}
                        className="phone"
                      />
                      <label>
                        <h2>
                          E-mail
                        </h2>
                      </label>
                      <input
                        required
                        id="email"
                        type="text"
                        name="email"
                        onChange={this.handleChange}
                        className="email"
                      />
                    </div>
                    <div className="margin-top-1rem text-align-right">
                      <button type="submit" className="sign-in-button">
                        <p onClick={this.reset} className="create-account-text">Create!</p>
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className={confirm}>
          <div className="column-full">
            <div className="row signup-box-container  sign-box-vertical">
              <div className="sign-up-confirmbox  sign-box-height">
                <h2>Thank you for being a valuable UsedElander!</h2>
                <p className="font-size-20">Click <a href="#sign-in"><span>HERE</span></a> to sign in</p>
              </div>
            </div>
          </div>
        </div>
        <div className={err}>
          <div className="column-full">
            <div className="row signup-box-container sign-box-vertical">
              <div className="sign-up-confirmbox sign-box-height">
                <h2>Sorry! The username already exists.</h2>
                <h2>Please try different username!</h2>
                <p>Click <a href="#sign-up"><span onClick={this.closeBox}>HERE</span></a> to try again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
