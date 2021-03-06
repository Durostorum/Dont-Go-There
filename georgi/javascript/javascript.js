var queryURL = "https://api.yelp.com/v3/businesses/search"

var key = "PHz4spwIAbO8IBmiVxup8uUnT3sLEbhxuQ8omoc8YFuDqYIWo7MR19D2JRVNo_YRfSyJI6tkjaaqjOpMjTs9hcT_DgkWlW3lfDEiNzW6LNWRhgRLZSbRDNSpU2k8XXYx"

//create variable based on the business.total number and then set the offset to start from there

//steps - GET original header request via ajax; originally is: hotels, restaurants, active places, doctors, 

//steps - get TOTAL from each request and sort by rating, then only show last 50

// THEN print only 1 to 2 star rated businesses

//  Then get business IDs from header request, get review pulls from that business ID

// then print out to divs

//creating variable based on the search bar input


var latlong = [{}]
var category = $("#categories").val()
var badBizCount = 0
//adding this later after editing the HTML to include categories: 
//var dontGoWhere = $("#something").val()


$("#enterButton").on("click", function () {
    var loader = $("#yelp").prepend('<img id="loader" src="images/loader.gif">')
    var search = $("#dragon").val()
    search = search.replace(/,/g, "+")
    search = search.replace(/ /g, "+")
    //need category dropdown and need to input it into the categories URL
    var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + search + "&categories=" + $("#categories").val() + "&limit=50&radius=2000"

    //add in code later: "&offset=" + totalresults - 50;""
    // var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=" + search + "&categories=" + dontGoWhere + "&limit=50&sort_by=rating&radius=2000&offset=" + totalresults - 50;

    $.ajax({
        url: myurl,
        headers: {
            'Authorization': 'Bearer PHz4spwIAbO8IBmiVxup8uUnT3sLEbhxuQ8omoc8YFuDqYIWo7MR19D2JRVNo_YRfSyJI6tkjaaqjOpMjTs9hcT_DgkWlW3lfDEiNzW6LNWRhgRLZSbRDNSpU2k8XXYx',
        },
        method: 'GET',
        dataType: 'json',
        beforeSend: function () {
            loader
        },
        complete: function () {
            $('#loader').hide();
        },
        success: function (data) {
            var badBizCount = 0;

            var totalresults = data.total;
            totalresults -= 50;
            totalresults.toString();

            console.log(totalresults)
            console.log(data)
            console.log(myurl)
            var secondURL = myurl + "&offset=" + totalresults
            console.log(secondURL)
            $.ajax({
                url: secondURL,
                headers: {
                    'Authorization': 'Bearer PHz4spwIAbO8IBmiVxup8uUnT3sLEbhxuQ8omoc8YFuDqYIWo7MR19D2JRVNo_YRfSyJI6tkjaaqjOpMjTs9hcT_DgkWlW3lfDEiNzW6LNWRhgRLZSbRDNSpU2k8XXYx',
                },
                method: 'GET',
                dataType: 'json',
                beforeSend: function () {
                    loader
                },
                complete: function () {
                    $('#loader').hide();
                },
                success: function (secondData) {
                    // Grab the results from the API JSON return
                    var business = secondData.businesses


                    console.log(secondData)
                    // If our results are greater than 0, continue
                    for (i = 0; i < business.length; i++) {
                        var item = business[i]
                        var reviewcount = item.review_count;
                        var rating = item.rating;
                        
                        if (rating < 3 && reviewcount > 9) {

                            // Itirate through the JSON array of 'businesses' which was returned by the API

                            // Store each business's object in a variable

                            var id = item.id;
                            var alias = item.alias;
                            var phone = item.display_phone;
                            var image = item.image_url;
                            var name = item.name;
                            var address = item.location.address1;
                            var city = item.location.city;
                            var state = item.location.state;
                            var zipcode = item.location.zip_code;

                            var bizlatlong = [item.coordinates.latitude + "," + item.coordinates.longitude]

                            // Append our result into our page
                            latlong.push(bizlatlong);

                            console.log(id)

                            badBizCount++;
                            $('#yelp').prepend('<div id="' + id + '" class="badBusinesses" style="margin-top:50px;margin-bottom:50px;"><img class="importedImg" src="' + image +'"><br><b>' + name + '</b><br> Located at: ' + address + ' ' + city + ', ' + state + ' ' + zipcode + '<br>The phone number for this business is: ' + phone + '<br>This business has a rating of ' + rating + ' with ' + reviewcount + ' reviews.<br><a class="yelpClick" yelp="' + id + '" href="javascript:void(0);">Click here for reviews</a></div>');


                        }

                    }
                    
                    $( ".importedImg" ).on("click", function() {
                        $(this).toggleClass( "importedImg zoomedImg" );
                        console.log("clicked");
                    })

                    console.log(badBizCount)
                    //why isn't this working?
                    console.log(latlong);
                    if (badBizCount > 0) {
                        $("#yelp").prepend("<h3>" + ($("#categories option:selected").text()) + ":</h3>")
                    } else {
                        $("#yelp").prepend("<h3>" + ($("#categories option:selected").text()) + ":</h3>" + "<h5>Hmmm....not that bad!</h5>")
                    }
                    // each ID gets a click that has an onclick event that generates 3 reviews underneath. and that onclick event will have an ajax called based on the ID of that element


                }

            })
        }
    })
}

)


$(document).on("click", ".yelpClick", function () {
    var loader = $("#yelp").prepend('<img id="loader" src="images/loader.gif">')
    event.preventDefault()
    var attrId = $(this).attr("yelp")

    var reviewURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/" + attrId + "/reviews"
    $.ajax({
        //get restaurant review search
        url: reviewURL,
        headers: {
            'Authorization': 'Bearer PHz4spwIAbO8IBmiVxup8uUnT3sLEbhxuQ8omoc8YFuDqYIWo7MR19D2JRVNo_YRfSyJI6tkjaaqjOpMjTs9hcT_DgkWlW3lfDEiNzW6LNWRhgRLZSbRDNSpU2k8XXYx',
        },
        method: 'GET',
        dataType: 'json',
        beforeSend: function () {
            loader
        },
        complete: function () {
            $('#loader').hide();
        },
        success: function (data) {
            console.log(data)
            badRatingCount = 0
            for (i = 0; i < data.reviews.length; i++) {
                var item = data.reviews[i]
                var id = item.id
                var rating = item.rating
                var reviewLinks = item.url;
                var text = item.text
                console.log(reviewLinks)
                if (rating == 0) {
                    $("#" + attrId).append('<img src="ari/images/yelp_stars/web_and_ios/small_0.png">')
                }
                if (rating == 1) {
                    $("#" + attrId).append('<img src="images/yelp_stars/web_and_ios/small/small_1.png">')
                }
                if (rating == 2) {
                    $("#" + attrId).append('<img src="images/yelp_stars/web_and_ios/small/small_2.png">')
                }
                if (rating == 3) {
                    $("#" + attrId).append('<img src="images/yelp_stars/web_and_ios/small/small_3.png">')
                }
                if (rating <= 3) {
                    badRatingCount++;
                    $("#" + attrId).append('<div class="reviewClass" id="' + id + '"><h6>Rating:' + rating + '</h6><p>' + text +  "</p> <a id='removeLinks' href=" + reviewLinks+" target='_blank'><span>click here for full review</a> <a href='' id='hideComment'> Hide comments</a>")

                    $();
                    $("#hideComment").on('click', function(e){
                        $("#removeLinks").remove();
                        e.preventDefault();

                    })
                }
            }
            if (badRatingCount = 0) {
                $("#" + attrId).append("<h6>Looks like yelp isn't giving us bad enough ratings....but trust us... this place is terrible!</h6>")
            }
            //add link to reviews
            //add image on click event to blow up the pictures
            //make the css prettier
            //get loading gif onto the site during ajax pulls
        }
    })
})