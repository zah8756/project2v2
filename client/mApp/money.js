const DomoList = function(props) {
    if(props.domos.length === 0) {
        return (
            <div className='domosList'>
                <h3 className='emptyDomo'>No Domos Yet</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(function(domo) {
        return (
            <div key={domo._id} className='domo'>
                <img src='/assets/img/domoFace.jpeg' alt='domo face' className='domoFace'/>
                <h3 className='domoName'> Name: {domo.name} </h3>
                <h3 className='domoMoney'> Money:$ {domo.money} </h3>
            </div>
        );
    });

    return (
        <div className='domoList'>
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} />, document.querySelector('#domos')
        );
    });
};

const setup = function() {
    ReactDOM.render(
        <DomoList domos={[]} />, document.querySelector('#domos')
    );

    loadDomosFromServer();
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// let socket = io();

$(document).ready(function() {
    getToken();
});