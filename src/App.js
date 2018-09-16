import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';

// Utillities
import $ from 'jquery';
import KinveyRequester from './KinveyRequester';

// Components
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import InfoBox from './components/InfoBox';

// Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import BooksView from './views/BooksView';


export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        username: sessionStorage.getItem("username"),
        userId: sessionStorage.getItem("userId")
    };
  }
  
  render() {
    return (
      <div className="App">
          <header>
              <NavigationBar
                username={this.state.username}
                homeClicked={this.showHomeView.bind(this)}
                loginClicked={this.showLoginView.bind(this)}
                  // registerClicked={this.showRegisterView.bind(this)}
                booksClicked={this.showBooksView.bind(this)}
                  // createBookClicked={this.showCreateBookView.bind(this)}
                logoutClicked={this.logout.bind(this)} 
                  />
              <div id="loadingBox">Loading ...</div>
              <div id="infoBox">Info</div>
              <div id="errorBox">Error</div>
          </header>
          <main id="main"></main>
          <Footer />
      </div>
    );
  }





  // UTILITIES -------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  componentDidMount() {
    $(document).on({
        ajaxStart: function() { $("#loadingBox").show() },
        ajaxStop: function() { $("#loadingBox").hide() }
    });

    $(document).ajaxError(this.handleAjaxError.bind(this));

    $("#infoBox, #errorBox").click(function() {
        $(this).fadeOut();
    });

    this.showHomeView();
  }
  
  showError(error) {
    let reacEl = <InfoBox error={error}></InfoBox>;
    console.log(reacEl)
    ReactDOM.render(reacEl, document.getElementById('main'));

    // let errDiv = $('<div>').attr('id','errorBox').text('Error ' + error.status + ' ' + error.statusText + ' (' + error.responseJSON.error + ')').css('color','red').addClass("alert alert-danger fade in");
    // console.log(errDiv)
    // $('#main').append(errDiv);
    // setTimeout(function() {
    //     errDiv.fadeOut(function() {
    //         errDiv.remove()
    //     });
    // }, 4000);
  }

  showInfo(message) {
    $('#infoBox').text(message).show();
    setTimeout(function() {
        $('#infoBox').fadeOut();
    }, 3000);
  }
  


  // VIEWS ------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------
  showView(reactViewComponent) {
    ReactDOM.render(reactViewComponent, document.getElementById('main'));
    $('#errorBox').hide();
  }

  showHomeView() {
      this.showView(<HomeView username={this.state.username} />);
  }

  showLoginView() {
    this.showView(<LoginView onsubmit={this.login.bind(this)} />);
  }

  showBooksView() {
    KinveyRequester.getAllBooks().then(loadBooksSuccess.bind(this));

    function loadBooksSuccess(books) {
      console.log(books)
      this.showInfo("Books loaded.");
      this.showView(
          <BooksView
              books={books}
              userId={this.state.userId}
              editBookClicked={this.prepareBookForEdit.bind(this)}
              deleteBookClicked={this.confirmBookDelete.bind(this)}
          />
      );
    }
  }

  prepareBookForEdit() {
    console.log(this)
    console.log('prepare for edit')
  }

  confirmBookDelete() {
    console.log(this)
    console.log('confirm delete')
  }

  // AJAX--------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------
  login(username, password) {
    KinveyRequester.loginUser(username, password)
        .then(loginSuccess.bind(this));

    function loginSuccess(userInfo) {
        this.saveAuthInSession(userInfo);
        this.showBooksView();
        this.showInfo("Login successful.");
    }
  }

  logout() {
    KinveyRequester.logoutUser();
    sessionStorage.clear();
    this.setState({username: null, userId: null});
    this.showHomeView();
    this.showInfo('Logout successful.');
  }

  handleAjaxError(event, response) {
    // let errorMsg = JSON.stringify(response);
    // if (response.readyState === 0)
    //     errorMsg = "Cannot connect due to network error.";
    // if (response.responseJSON && response.responseJSON.description)
    //     errorMsg = response.responseJSON.description;
    this.showError(response);
  }

  saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken);
    sessionStorage.setItem('userId', userInfo._id);
    sessionStorage.setItem('username', userInfo.username);

    // This will update the entire app UI (e.g. the navigation bar)
    this.setState({
        username: userInfo.username,
        userId: userInfo._id
    });
  }
}