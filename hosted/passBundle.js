"use strict";

var handleChange = function handleChange(e) {
    e.preventDefault();

    $("#playerMessage").animate({ width: 'hide' }, 350); //change

    if ($("oldPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

    if ($('#newPass1').val() !== $('#newPass2').val()) {
        handleError("Passwords do not match.");
        return false;
    }

    if ($('#oldPass').val() === $('#newPass1').val()) {
        handleError("New Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), function () {
        handleError('Password has changed');
    });

    return false;
};

var ChangeWindow = function ChangeWindow(props) {
    return React.createElement(
        "form",
        { id: "changeForm", name: "changeForm",
            onSubmit: handleChange,
            action: "/changePassword",
            method: "POST",
            className: "changeForm" },
        React.createElement(
            "label",
            { htmlFor: "username" },
            "Old Password: "
        ),
        React.createElement("input", { id: "oldPass", type: "text", name: "oldPass", placeholder: "old password" }),
        React.createElement(
            "label",
            { htmlFor: "pass" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass1", type: "password", name: "newPass1", placeholder: "new password" }),
        React.createElement(
            "label",
            { htmlFor: "pass2" },
            "New Password: "
        ),
        React.createElement("input", { id: "newPass2", type: "password", name: "newPass2", placeholder: "retype new password" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "formSubmit", type: "submit", value: "change password" })
    );
};

// const createChangeWindow = (csrf) => {
//     ReactDOM.render(
//         <ChangeWindow csrf={csrf} />,
//         document.querySelector('#content')
//     );
// };

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(ChangeWindow, { csrf: csrf }), document.querySelector('#content'));
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
  console.log('there is an error');
  $('#errorMessage').text(message);
  $('#playerMessage').animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $('#playerMessage').animate({ width: 'hide' }, 350);
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
