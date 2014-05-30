/**
 * @jsx React.DOM
 */

$(document).ready(function(){
    React.renderComponent(
      <MainComponent />,
      document.getElementById('body')
    );

    $('.signInButton').click(function(){
      $('#sign-in').toggle();
    });

    $('.button').click(function(){
      $('#newEntryForm').hide()
        .find("input[type=text]").val("")
        .find("input[type=date]").val("");
    });
});