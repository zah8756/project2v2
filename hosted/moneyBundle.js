'use strict';

var DomoList = function DomoList(props) {
    if (props.domos.length === 0) {
        return React.createElement(
            'div',
            { className: 'domosList' },
            React.createElement(
                'h3',
                { className: 'emptyDomo' },
                'No Domos Yet'
            )
        );
    }

    var domoNodes = props.domos.map(function (domo) {
        return React.createElement(
            'div',
            { key: domo._id, className: 'domo' },
            React.createElement('img', { src: '/assets/img/domoFace.jpeg', alt: 'domo face', className: 'domoFace' }),
            React.createElement(
                'h3',
                { className: 'domoName' },
                ' Name: ',
                domo.name,
                ' '
            ),
            React.createElement(
                'h3',
                { className: 'domoMoney' },
                ' Money:$ ',
                domo.money,
                ' '
            )
        );
    });

    return React.createElement(
        'div',
        { className: 'domoList' },
        domoNodes
    );
};

var loadDomosFromServer = function loadDomosFromServer() {
    sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos }), document.querySelector('#domos'));
    });
};

var setup = function setup() {
    ReactDOM.render(React.createElement(DomoList, { domos: [] }), document.querySelector('#domos'));

    loadDomosFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

// let socket = io();

$(document).ready(function () {
    getToken();
});
'use strict';

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
