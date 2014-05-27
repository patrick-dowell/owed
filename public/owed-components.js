/**
 * @jsx React.DOM
 */
var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

var TitleComponent = React.createClass({
  render: function() {
    if (this.props.title === "") {
      return (<span></span>);
    }
    else {
      return (
        <h2>{this.props.title}</h2>
      );
    }
  }
});

var ContentComponent = React.createClass({
  render: function() {
    return (
      <p>{this.props.text}</p>
    );
  }
});

var FlashComponent = React.createClass({
  render: function() {
    return (<span>{this.props.message}</span>);
  }
});

var SignInComponent = React.createClass({
  handleSubmit: function() {
    comp = this;
    $.ajax({
      url: '/login2',
      dataType: 'json',
      type: 'post',
      data: {
        username: $('#username').val(),
        password: $('#password').val()
      },
      success: function(data) {
        if (data.user) {
          $('#sign-in').toggle();
          comp.props.onSignInAttempt(data);
        }
        else {
          comp.props.onSignInAttempt(data);
        }

      },
      error: function(xhr, status, err) {
        console.error('/login2', status, err.toString());
      }
    });

    return false;
  },
  render: function() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" id="username"/><br/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" id="password"/>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
    </form>
    );
  }
});

var MainComponent = React.createClass({
  getInitialState: function() {
    return {title: "",
    message: "",
    content: ""};
  },
  updateSignInState: function(data) {
    this.setState({
      message: data.message
    });
    comp = this;
    updateSignInOutButtons(data, comp);
  },
  performLogout: function() {
    $.ajax({
      url: '/logout2',
      dataType: 'json',
      success: function(data) {
        this.setState({
          message: data.message
        });
        comp = this;
        updateSignInOutButtons(data, comp);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error('/logout2', status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div>
        <div className="topnav">
        	<h1>
        		Owed
        	</h1>
        	<ul id="topnav_controls">
            <li className="signInButton">Sign In</li>
            <li className="signOutButton">Sign Out</li>
        	</ul>
        </div>

        <div id="sign-in">
          <SignInComponent onSignInAttempt={this.updateSignInState}/>
        </div>

        <div id="main">
          <div id="title">
            <TitleComponent title={this.state.title}/>
          </div>
          <div id="message">
            <FlashComponent message={this.state.message}/>
          </div>
          <div id="content">
            <ContentComponent text={this.state.content}/>
          </div>
        </div>

        <div className="footer">
        	<ul id="botnav_controls">
            <li className="signInButton">Sign In</li>
            <li className="signOutButton">Sign Out</li>
        	</ul>
        	<p>
        		Owed Copyright &copy; 2014 <a href="http://www.phasesix.net/">Phase Six</a>.  All rights reserved.
        	</p>
        </div>
      </div>
    );
  },
  componentWillMount: function() {
      $.ajax({
        url: '/home',
        dataType: 'json',
        success: function(data) {
          this.setState({
            title: data.title,
            message: data.message,
            content: data.text
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/home', status, err.toString());
        }.bind(this)
      });

      comp = this;

      $.ajax({
        url: '/checklogin',
        dataType: 'json',
        success: function(data) {
          updateSignInOutButtons(data, comp);
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/checklogin', status, err.toString());
        }.bind(this)
      });
  },
});

function updateSignInOutButtons(data, comp) {
  if (data.user) {
    $('.signInButton').hide();
    $('.signOutButton').show();
  }
  else {
    $('.signInButton').show();
    $('.signOutButton').hide();
  }

  $('.signOutButton').click(function () {
    comp.performLogout();
  });
}
