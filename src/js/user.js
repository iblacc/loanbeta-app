$(document).ready(function(){

  // Check if logged in
  $.ajax({
    method: "GET",
    url: "http://localhost:3000/loggedIn"
  }).done(function(loggedInUser) {
      if(loggedInUser.length === 0) {
        window.location.replace("login.html");
      } else if(loggedInUser[0].admin === 'false'){
        $.ajax({
          method: "GET",
          url: "http://localhost:3000/users/" + loggedInUser[0].id + "/loans"
        })
          .done(function(loans) {
            if(loans.length === 0) {
              $('#userTable').after(`<div class="card">
                                          <div class="card-body text-center">There are no loan requests.</div>
                                        </div>`);
            }
            let template = '';
      
            loans.forEach(function(el, index) {
              
              template +=   `<tr>`;
              template +=     `<th scope="row">${index + 1}</th>`;
              template +=     `<td>${el.type}</td>`;
              
              if(el.status === 'pending') {
                template +=     `<td class="text-secondary">${el.status}</td>`;
                template +=     `<td>`;
                template +=       `<button type="button" data-id="${el.id}" class="removeRequest btn btn-outline-danger mr-3 btn-sm">Remove</button>`;
                template +=     `</td>`;
              } else if(el.status === 'approved') {
                template +=     `<td class="text-success">${el.status}</td>`;
                template +=     `<td></td>`;
              } else {
                template +=     `<td class="text-danger">${el.status}</td>`;
                template +=     `<td></td>`;
              }
              
              template +=   `</tr>`;
      
            });
      
            $('#userTable tbody').append(template);

            $('#signOut').on('click', function(){
              $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/loggedIn/" + loggedInUser[0].id
              }).done(function(){
                window.location.replace("index.html");
              }).fail(function(){
                console.log('Logged in user DELETE request failed');
              })
            });
      
            $('.removeRequest').on('click', function(){
              let $this = $(this);
              $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/loans/" + $this.data("id")
              }).done(function(loan){
                $this.hide();
                location.reload();
              });
            });

            $('#requestPanelButton').on('click', function(){
              $('#loantypes').slideToggle(1000);
            });

            $('#loantypes button').on('click', function(){
              let loanType = $(this).data("name");

              let data = new Object();
              data.type = loanType;
              data.firstname = loggedInUser[0].firstname;
              data.lastname = loggedInUser[0].lastname;
              data.userId = loggedInUser[0].id;
              data.status = "pending";
              
              $.ajax({
                method: "POST",
                url: "http://localhost:3000/loans",
                data: data
              })
                .done(function(user) {
                  console.log("User added to database");
                  $('#loantypes').slideUp(1000, function(){
                    location.reload();
                  });
                  
                  // window.location.replace("login.html");
                })
                .fail(function(){
                  console.log('Post request failed');
                });

            })
          })
          .fail(function(){
            console.log('Get request failed');
          });
        
      } else {
        window.location.replace("index.html");
      }
  });


});