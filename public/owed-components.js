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

var ContentType = {
  HOME: 0,
  ENTRIES: 1,
  NONE: 3
};

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

var EntryComponent = React.createClass({
  render: function() {
    return (
	    <tr className="entries">
        <td>
          {this.props.id}
        </td>
        <td>
          {(new Date(this.props.date)).toDateString()}
        </td>
        <td>
	        ${this.props.owed}
        </td>
		    <td>
          {this.props.description}
			  </td>
	    </tr>
    );
  }
});

var NewEntryComponent = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var entry = {
      owed: this.refs.owed.getDOMNode().value,
      date: this.refs.date.getDOMNode().value,
      description: this.refs.description.getDOMNode().value
    };
    comp = this;
    $.ajax({
      url: '/entry2/new',
      dataType: 'json',
      type: 'post',
      data: entry,
      success: function(data) {
        if (data.user) {
          entry.id = data.entryId;
          comp.props.entryHandler(entry);
        }
        else {
          alert("failed to create a new entry!"); // TODO: fix this
        }
      },
      error: function(xhr, status, err) {
        console.error('/entry2/new', status, err.toString());
      }
    });

  },
  render: function() {
    return (
      <form id="newEntryForm" className="row" onSubmit={this.handleSubmit}>
  		  <label>Amount Owed: $</label>
        <input type="text" ref="owed" required />
  		  <br />
  		  <label>Date:</label>
        <input type="date" ref="date" required />
  		  <br />
  		  <label>Description:</label>
        <input type="text" ref="description" required />
  		  <br />
  		  <div className="centersubmit">&nbsp;</div>
  		  <input type="submit" value="submit" />
  	  </form>
    )
  }
});

var ContentComponent = React.createClass({
  render: function() {
    if (this.props.contentType == ContentType.HOME) {
      return (
        <p>{this.props.text}</p>
      );
    }
    else if (this.props.contentType == ContentType.ENTRIES) {
      var entries = this.props.entries.map(function (entry) {
            return <EntryComponent id={entry.id} date={entry.date} owed={entry.owed} description={entry.description}/>;
          });
      return (
        <div className="entries">
          <table>
        	  <thead>
        		  <th>
        			  Id#
        		  </th>
        		  <th>
        			  Date
        		  </th>
        		  <th>
    	    		  Amount
        		  </th>
        		  <th>
        			  Description
        		  </th>
        	  </thead>
        	  <tbody className="entries">
              { entries }
    		    </tbody>
    	    </table>
          <p>
            <span id="newEntryButton">New Entry</span>

          </p>
    	  </div>
      );
    }
    else {
      return (<p>No Content</p>);
    }

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
        username: comp.refs.username.getDOMNode().value,
        password: comp.refs.password.getDOMNode().value
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
          <input type="text" ref="username"/><br/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" ref="password"/>
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
    return {
      title: "",
      message: "",
      content: "",
      entries: [],
      contentType: ContentType.NONE
    };
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
  addEntry: function(entry) {
    this.setState({
      entries: [entry].concat(this.state.entries)
    });
  },
  render: function() {
    return (
      <div>
        <header>
        	<h1>
        		Owed
        	</h1>
        	<ul>
            <li className="signInButton">Sign In</li>
            <li className="signOutButton">Sign Out</li>
        	</ul>
        </header>

        <div id="sign-in" className="container-fluid">
          <SignInComponent onSignInAttempt={this.updateSignInState}/>
        </div>

        <main className="container">
          <div id="title" className="row">
            <TitleComponent title={this.state.title}/>
          </div>
          <div id="message" className="row">
            <FlashComponent message={this.state.message}/>
          </div>
          <div id="content" className="row">
            <ContentComponent text={this.state.content}
              contentType={this.state.contentType}
              entries={this.state.entries} />
          </div>
          <div id="newEntry" className="row">
            <NewEntryComponent entryHandler={this.addEntry}/>
          </div>
        </main>

        <footer>
        	<ul>
            <li className="signInButton">Sign In</li>
            <li className="signOutButton">Sign Out</li>
        	</ul>
        	<p>
        		Owed Copyright &copy; 2014 <a href="http://www.phasesix.net/">Phase Six</a>.  All rights reserved.
        	</p>
        </footer>
      </div>
    );
  },
  componentWillMount: function() {
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
    if (comp.state.contentType != ContentType.ENTRIES) {
      // get the entries page
      $.ajax({
        url: '/entries2',
        dataType: 'json',
        success: function(data) {
          if (data.user) {  // success
            comp.setState({
              title: data.title,
              message: data.message,
              entries: data.entries,
              contentType: ContentType.ENTRIES
            });
            $("#newEntryButton").click(function () {
              $("#newEntryForm").toggle();
            });
          }
          else {
            comp.setState({ message: data.message });
          }
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/entries', status, err.toString());
        }.bind(this)
      });
    }
  }
  else {
    $('.signInButton').show();
    $('.signOutButton').hide();
    if (comp.state.contentType != ContentType.HOME) {
      // get the homepage
      $.ajax({
        url: '/home',
        dataType: 'json',
        success: function(data) {
          comp.setState({
            title: data.title,
            message: data.message,
            content: data.text,
            entries: [],
            contentType: ContentType.HOME
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error('/home', status, err.toString());
        }.bind(this)
      });
    }
  }

  $('.signOutButton').click(function () {
    comp.performLogout();
  });
}
