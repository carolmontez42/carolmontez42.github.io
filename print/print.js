// Source: https://playdead.com/js/dist.js
// Full repo available at https://github.com/carolmontez42/carolmontez42.github.io


// no input
var rep1 = function () {
  $('#con').html(`/-comms gateway established............/<br>/-..................encryption approved/<br>/-..................no message received/`);
}

// incorrect
var rep2 = function () {
  $('#con').html(`/-comms gateway established............/<br>/-..................encryption approved/<br>/-...........incorrect message received/`);
}

// failure
var failP = function (e) {
  $('#con').html(e);
  if (!(/overload/.test(e))) {
    $('#con').append(`<br><br><br>print.js utilizes a proxy server to validate the CORS headers.<br>Number of requests per period is limited, and may fail to return data<br><br>Read for more: <ins onclick="window.open('https://github.com/carolmontez42/carolmontez42.github.io#cors-anywhere')">https://github.com/carolmontez42/carolmontez42.github.io#cors-anywhere</ins>`);
  }
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


var s_guid = '';

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

  if (p_input != '' && p_input != s_guid) {
    if (pattern.test(p_input)) {
      s_guid = p_input;
      $('#idn_cl').attr('readonly', 'true').css({'color': 'rgb(112, 112, 112)'}).val('Saved');
      setTimeout(function() {$('#idn_cl').removeAttr('readonly').css({'color': ''}).val(s_guid);}, 1500);
    } else {
      $('#idn_cl').attr('readonly', 'true').css({'color': 'rgb(156, 13, 16)', 'font-style': 'italic'}).val('Invalid GUID');
      setTimeout(function() {$('#idn_cl').removeAttr('readonly').css({'color': '', 'font-style': ''}).val(s_guid);}, 1500);
    }
  } else {
    s_guid = guid();
    $('#idn_cl').val(s_guid);
  }
}


// send request
var printP = function () {

  $('#con').html(`<span class="fa fa-refresh fa-spin" style="color: rgb(156, 13, 16);">`);

  // user input
  var s_input = $('#box').val();

  var data = {in: s_input, id: s_guid, check: 'true', url: '/'};
  $.post('https://acorn42.herokuapp.com/https://playdead.com/print/prepare.php', data).done(function() {});

  if (s_input != '') {
    $.post('https://acorn42.herokuapp.com/https://playdead.com/print/index.php', data).done(function(data) {
      if (data == 'false') {
        rep2();
      } else {
        var _data = {in: s_input, id: s_guid};
        $.post('https://acorn42.herokuapp.com/https://playdead.com/print/index.php', _data).done(function(data) {$('#con').html(data);}).fail(function(jqXHR) {failP(jqXHR.responseText);});
      }
    }).fail(function(jqXHR) {failP(jqXHR.responseText);});
  } else {rep1();}
}
