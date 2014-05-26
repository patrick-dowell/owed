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

$(document).ready(function(){
    $('.entries tr').click(function(){
        window.location = $(this).attr('href');
        return false;
    });

    React.renderComponent(
      <CommentBox />,
      document.getElementById('content')
    );
});

