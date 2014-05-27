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
});