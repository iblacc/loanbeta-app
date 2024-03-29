$(document).ready(function(){

  $.ajax({
    method: "GET",
    url: "http://localhost:3000/loggedIn"
  }).done(function(loggedInUser) {
      if(loggedInUser.length === 0) {
        window.location.replace("login.html");
      } else if(loggedInUser[0].admin === 'true') {

        $('#adminName').html(loggedInUser[0].firstname);

        // Pending request logic
        $.ajax({
          method: "GET",
          url: "http://localhost:3000/loans?status=pending"
        })
          .done(function(loans) {
            if(loans.length === 0) {
              $('#pendingTable').after(`<div class="card">
                                          <div class="card-body text-center">There are no pending requests.</div>
                                        </div>`);
            }
            let template = '';
      
            loans.forEach(function(el, index) {
              
              template +=   `<tr>`;
              template +=     `<th scope="row">${index + 1}</th>`;
              template +=     `<td>${el.firstname}</td>`;
              template +=     `<td>${el.lastname}</td>`;
              template +=     `<td>${el.type}</td>`;
              template +=     `<td>${el.status}</td>`;
              template +=     `<td>`;
              template +=       `<button type="button" data-id="${el.id}" class="approve btn btn-outline-primary mr-3 btn-sm">Approve</button>`;
              template +=       `<button type="button" data-id="${el.id}" class="decline btn btn-outline-danger btn-sm">Decline</button>`;
              template +=     `</td>`;
              template +=   `</tr>`;
      
            });
      
            $('#pendingTable tbody').append(template);

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
      
            $('.approve').on('click', function(){
              let $this = $(this);
              $.ajax({
                method: "PATCH",
                url: "http://localhost:3000/loans/" + $this.data("id"),
                data: {status: "approved"}
              }).done(function(loan){
                $this.hide();
                $this.next().hide();
                location.reload();
              });
            });
      
            $('.decline').on('click', function(){
              let $this = $(this);
              $.ajax({
                method: "PATCH",
                url: "http://localhost:3000/loans/" + $this.data("id"),
                data: {status: "declined"}
              }).done(function(loan){
                $this.hide();
                $this.prev().hide();
                location.reload();
              });
            });
      
          })
          .fail(function(){
            console.log('Get request failed');
          });
      
      
        // Approved request logic
        $.ajax({
          method: "GET",
          url: "http://localhost:3000/loans?status=approved"
        })
          .done(function(loans) {
            if(loans.length === 0) {
              $('#approvedTable').after(`<div class="card">
                                          <div class="card-body text-center">There are no approved requests.</div>
                                        </div>`);
            }
            let template = '';
      
            loans.forEach(function(el, index) {
              
              template +=   `<tr>`;
              template +=     `<th scope="row">${index + 1}</th>`;
              template +=     `<td>${el.firstname}</td>`;
              template +=     `<td>${el.lastname}</td>`;
              template +=     `<td>${el.type}</td>`;
              template +=     `<td class="text-success">${el.status}</td>`;
              template +=     `<td>`;
              template +=       `<button type="button" data-id="${el.id}" class="removeRequest btn btn-outline-danger mr-3 btn-sm">Remove</button>`;
              template +=     `</td>`;
              template +=   `</tr>`;
      
            });
      
            $('#approvedTable tbody').append(template);
      
            $('.removeRequest').on('click', function(){
              let $this = $(this);
              $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/loans/" + $this.data("id")
              }).done(function(loan){
                $this.hide();
              });
            });
          })
          .fail(function(){
            console.log('Get request failed');
          });
      
      
        // Declined request logic
        $.ajax({
          method: "GET",
          url: "http://localhost:3000/loans?status=declined"
        })
          .done(function(loans) {
            if(loans.length === 0) {
              $('#declinedTable').after(`<div class="card">
                                          <div class="card-body text-center">There are no declined requests.</div>
                                        </div>`);
            }
            let template = '';
      
            loans.forEach(function(el, index) {
              
              template +=   `<tr>`;
              template +=     `<th scope="row">${index + 1}</th>`;
              template +=     `<td>${el.firstname}</td>`;
              template +=     `<td>${el.lastname}</td>`;
              template +=     `<td>${el.type}</td>`;
              template +=     `<td class="text-danger">${el.status}</td>`;
              template +=     `<td>`;
              template +=       `<button type="button" data-id="${el.id}" class="removeRequest btn btn-outline-danger mr-3 btn-sm">Remove</button>`;
              template +=     `</td>`;
              template +=   `</tr>`;
      
            });
      
            $('#declinedTable tbody').append(template);
      
            $('.removeRequest').on('click', function(){
              let $this = $(this);
              $.ajax({
                method: "DELETE",
                url: "http://localhost:3000/loans/" + $this.data("id")
              }).done(function(loan){
                $this.hide();
              });
            });
          })
          .fail(function(){
            console.log('Get request failed');
          });



      } else {
        window.location.replace("index.html");
      }


    });


});