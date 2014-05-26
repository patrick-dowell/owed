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

});