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

var MainComponent = React.createClass({
  getInitialState: function() {
    return {title: "",
    message: "",
    content: ""};
  },
  render: function() {
    return (
      <div>
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
  }
});
