

$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
  });
  function imgError(place) {
      place.src='https://i.hizliresim.com/rxb5f2.png';
  }
  var i = 0;
  var txt = "<a href='' style='color: #FF5349'>Copyright UnitiUptime 2021</a>";
  var speed = 50;
  
  $(function() {
      document.getElementById("typeText").innerHTML = txt;
  });
  // make it as accordion for smaller screens
  if ($(window).width() < 992) {
    $('.dropdown-menu a').click(function(e){
      e.preventDefault();
        if($(this).next('.submenu').length){
          $(this).next('.submenu').toggle();
        }
        $('.dropdown').on('hide.bs.dropdown', function () {
       $(this).find('.submenu').hide();
    })
    });
  }
  $(function(){
      $('.dropdown').hover(function() {
          $(this).addClass('open');
      },
      function() {
          $(this).removeClass('open');
      });
  });
