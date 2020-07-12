// JQuery already included in adminheader.ejs file
// tinymce editor fot text area if you want to use this uncomment script tag in adminfooter.ejs file
// $(function () {
//         tinymce.init({
//             selector: '#mytextarea'
//           });
//     });

// CKEditor
// ClassicEditor
//         .create( document.querySelector( '#mytextarea' ) )
//         .then( mytextarea => {
//                 console.log( mytextarea );
//         } )
//         .catch( error => {
//                 console.error( error );
//         } );

$('a.confirmDeletion').on('click', function () {
        if (!confirm('Do you really want to Delete')) {
                return false;
        }
});

//Categories Dropdown header.ejs file
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}
//window.addEventListener('click', function(event) {
//  if (!event.target.matches('.dropbtn')) {
//    var dropdowns = document.getElementsByClassName("dropdown-content");
//    var i;
//    for (i = 0; i < dropdowns.length; i++) {
//      var openDropdown = dropdowns[i];
//      if (openDropdown.classList.contains('show')) {
//        openDropdown.classList.remove('show');
//      }
//    }
//  }
////});


//SubCategory Dropdown header.ejs file
function myFunction1() {
  document.getElementById("myDropdown1").classList.toggle("show1");
  document.getElementById("myDropdown").classList.toggle("showw1");
}



//Username Dropdown header.ejs file
function myFunction2() {
  document.getElementById("myDropdown2").classList.toggle("show2");
}
// Close the dropdown if the user clicks outside of it
//window.addEventListener('click', function(event) {
//  if (!event.target.matches('.dropbtn1')) {
//    var dropdowns1 = document.getElementsByClassName("dropdown-content1");
//    var j;
//    for (j = 0; j < dropdowns1.length; j++) {
//      var openDropdown1 = dropdowns1[j];
//      if (openDropdown1.classList.contains('show1')) {
//        openDropdown1.classList.remove('show1');
//      }
//    }
//  }
//});

///*
//Add to cart fly effect with jQuery. - May 05, 2013
//(c) 2013 @ElmahdiMahmoud - fikra-masri.by
//license: https://www.opensource.org/licenses/mit-license.php
//*/   

$('.add-to-cart').on('click', function () {
        var cart = $('.shopping-cart');
        var imgtodrag = $(this).parents('.item').find("img").eq(0);
        if (imgtodrag) {
            var imgclone = imgtodrag.clone()
                .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
                .css({
                'opacity': '0.5',
                    'position': 'absolute',
                    'height': '150px',
                    'width': '150px',
                    'z-index': '100'
            })
                .appendTo($('body'))
                .animate({
                'top': cart.offset().top + 10,
                    'left': cart.offset().left + 10,
                    'width': 75,
                    'height': 75
            }, 500, 'easeInOutExpo');
            
            //setTimeout(function () {
            //    cart.effect("shake", {
            //        times: 2
            //    }, 100);
//            }, 500);

            imgclone.animate({
                'width': 0,
                    'height': 0
            }, function () {
                $(this).detach()
            });
        }
    });
//$("a.question[href]").click(function(e){
//    e.preventDefault();
//    if (this.href) {
//        var target = this.href;
//        setTimeout(function(){
//            window.location = target;
//        }, 0);
//    }
//});


//GeoLocation in buy.ejs file  
        function getlocation(){ 
            if(navigator.geolocation){ 
                navigator.geolocation.getCurrentPosition( showPos, showErr);
 		$( "#gettingloc" ).show();

            }
            else{
                alert("Sorry! your Browser does not support Geolocation API")
            }
        } 
        //Showing Current Poistion on Google Map
        function showPos(position){ 
             latt = position.coords.latitude; 
             long = position.coords.longitude; 
		const data = { latt, long};
		const options = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json'
				},
			body: JSON.stringify(data)
		};
		fetch('/users/location', options);
		$("#locbuynow").show();
 		$( "#d2" ).hide();
 		$( "#gettingloc" ).hide();
        } 

        //Handling Error and Rejection
             function showErr(error) {
              switch(error.code){
              case error.PERMISSION_DENIED:
             alert("You denied the request for Accessing Location. Enter Address Manually (OR) Clear site settings in your Browser and give access to your Location to Serve better");
 		$( "#d2" ).show();
 		$( "#locbuynow" ).hide();
              break;
             case error.POSITION_UNAVAILABLE:
             alert("You location information is unavailable.");
            break;
            case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
           case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
           }
        }   


