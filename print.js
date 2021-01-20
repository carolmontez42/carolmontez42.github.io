// CORS Anywhere (https://github.com/Rob--W/cors-anywhere)
var cors = function () {window.open('https://github.com/Rob--W/cors-anywhere')};

// Full repo at https://github.com/carolmontez42/carolmontez42.github.io
var git = function () {window.open('https://github.com/carolmontez42/carolmontez42.github.io')};


// no input
var rep1 = function () {
  $('#con').html('/-comms gateway established............/<br>/-..................encryption approved/<br>/-..................no message received/');
}

// incorrect
var rep2 = function () {
  $('#con').html('/-comms gateway established............/<br>/-..................encryption approved/<br>/-...........incorrect message received/');
}

// failure
var failP = function () {
  $("#con").html('<i style="color: #9c0d10;">jqXHR failed to retrieve data</i><br><br><br>Please note that print.js utilizes a proxy server to validate the CORS headers.<br>Number of requests per period is limited, and may fail to return data<br><br>Read for more: <ins onclick="cors()">https://github.com/Rob--W/cors-anywhere</ins>');
}

// print page
var printI = function () {
  $('#a').css({'visibility': 'hidden'});
  $('#con').css({'left': '0'});
  setTimeout(function() {
    window.print();
    $('#a').css({'visibility': ''});
    $('#con').css({'left': ''});
  }, 1000);
}


var guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// set GUID
var setid = function () {

  var p_input = $('#idn_cl').val();
  var pattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if ('id' in localStorage && p_input != localStorage.getItem('id') && p_input != "") {
    if (pattern.test(p_input) === true) {
      localStorage.setItem('id', p_input);
      $('#idn_cl').attr('readonly', 'true').css({'color': '#707070'}).val('Saved');
      setTimeout(function() {$('#idn_cl').removeAttr('readonly').css({'color': ''}).val(localStorage.getItem('id'));}, 1500)
    } else {
      $('#idn_cl').attr('readonly', 'true').css({'color': '#9c0d10', 'font-style': 'italic'}).val('Invalid GUID');
      setTimeout(function() {$('#idn_cl').removeAttr('readonly').css({'color': '', 'font-style': ''}).val(localStorage.getItem('id'));}, 1500)
    }
  } else {
    localStorage.setItem('id', guid());
    $('#idn_cl').val(localStorage.getItem('id'));
  }
}


// Source: https://playdead.com/js/dist.js
var printP = function () {

  if (!('id' in localStorage)) {setid();}
  $("#con").html('<span class="fa fa-refresh fa-spin" style="color: #9c0d10;">');

  // request
  var s_input = $('#box').val();

  var data = {in: s_input, id: localStorage.getItem('id'), check: 'true', url: '/'};
  $.post('https://playcors42.herokuapp.com/https://playdead.com/print/prepare.php', data).done(function() {});

  if (s_input != "") {
    $.post('https://playcors42.herokuapp.com/https://playdead.com/print/index.php', data).done(function(data) {
      if (data == 'false') {rep2();}
      else {
        var _data = {in: s_input, id: localStorage.getItem('id')};
        $.post('https://playcors42.herokuapp.com/https://playdead.com/print/index.php', _data).done(function(data) {$('#con').html(data);}).fail(function() {failP();});
      }
    }).fail(function() {failP();});
  } else {rep1();}
}