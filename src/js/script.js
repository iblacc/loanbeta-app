$(document).ready(function(){

  // Request page logic
  $('#requestNavLink').on('click', function(){
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/loggedIn"
    }).done(function(loggedInUser) {
        if(loggedInUser.length === 0) {
          window.location.replace("login.html");
        } else if(loggedInUser[0].admin === 'true') {
          window.location.replace("admin.html");
        }else if(loggedInUser[0].admin === 'false') {
          window.location.replace("user.html");
        }
      });
  });

  // Sign up logic
  $('#signupForm').submit(function(e){
    e.preventDefault();
    let username = $('#signupUser').val();

    $.ajax({
      method: "GET",
      url: "http://localhost:3000/users?username=" + username
    })
      .done(function(user) {
        if(user.length !== 0) {
          $('#signupError').html(username + " already existing");
          $('#signupUser').val('');
          console.log('User already exixting');
          
        } else if($('#signupPassword').val() !== $('#signupPassword2').val()) {
          $('#signupError').html("Passwords do not match");
          console.log('passwords do not match');
        } else {
            
            let data = new Object();
            data.firstname = $('#firstName').val();
            data.lastname = $('#lastName').val();
            data.username = $('#signupUser').val();
            data.email = $('#signupEmail').val();
            data.password = $('#signupPassword').val();
            data.admin = $('#adminCheck').is(':checked');
            $.ajax({
              method: "POST",
              url: "http://localhost:3000/users",
              data: data
            })
              .done(function(user) {
                console.log("User added to database");
                window.location.replace("login.html");
              })
              .fail(function(){
                console.log('Post request failed');
              });
          }
      })
      .fail(function(){
        console.log('Get request failed');
      });    
  });

  // Login logic
  $('#loginForm').submit(function(e){
    e.preventDefault();
    let username = $('#loginUser').val();
    $.ajax({
      method: "GET",
      url: "http://localhost:3000/users?username=" + username
    }).done(function(user){
      if(user.length === 0) {
        $('#loginError').html(username + " does not exist, please sign up");
        $('#loginUser').val('');
      } else if(user[0].password !== $('#loginPassword').val()) {
        // console.log(user[0].password);

        $('#loginError').html("Password incorrect");
        $('#loginPassword').val('');
      } else {
        $('#loginError').html("");
        console.log(user[0].password);
      }
    })
    .fail(function(){
      console.log('Request failed');
    });
  });


});