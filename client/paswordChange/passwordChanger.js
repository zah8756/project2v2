const handleChange = (e) => {
    e.preventDefault();

    $("#playerMessage").animate({width: 'hide'}, 350);//change

    if($("oldPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
        handleError("All fields are required");
        return false;
    }

   
    if($('#newPass1').val() !== $('#newPass2').val()) {
        handleError("Passwords do not match.");
        return false;
    }

    if($('#oldPass').val() === $('#newPass1').val()) {
        handleError("New Password is the same as old password.");
        return false;
    }

    sendAjax('POST', '/changePassword', $('#changeForm').serialize(), () => {
        handleError('Password has changed');
    });

    return false;
};

const ChangeWindow = (props) => {
    return (
        <form id='changeForm' name='changeForm'
            onSubmit={handleChange}
            action='/changePassword'
            method='POST'
            className='changeForm'>
            <label htmlFor='username'>Old Password: </label>
            <input id='oldPass' type='text' name='oldPass' placeholder='old password' />
            <label htmlFor='pass'>New Password: </label>
            <input id='newPass1' type='password' name='newPass1' placeholder='new password' />
            <label htmlFor='pass2'>New Password: </label>
            <input id='newPass2' type='password' name='newPass2' placeholder='retype new password' />
            <input type='hidden' name='_csrf' value={props.csrf} />
            <input className='formSubmit' type='submit' value='change password' />
        </form>
    );
};

const setup = (csrf) => {
    ReactDOM.render(
        <ChangeWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});




