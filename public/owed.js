/**
 * @jsx React.DOM
 */

$(document).ready(function(){
    $('.entries tr').click(function(){
        window.location = $(this).attr('href');
        return false;
    });

    React.renderComponent(
      <MainComponent />,
      document.getElementById('main')
    );

    React.renderComponent(
      <SignInButtonComponent />,
      document.getElementById('topnav_controls')
    );

    React.renderComponent(
      <SignInButtonComponent />,
      document.getElementById('botnav_controls')
    );

    React.renderComponent(
      <SignInComponent />,
      document.getElementById('sign-in')
    );

    $('#topnav_controls').click(
      function(){
        $('#sign-in').toggle();
      }
    );

});