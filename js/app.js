$(document).ready(function (){

    //initialize global variables starts ------------------
    var MAX_PAGES = 0;
    var KEY = "a8a36cee073bf89c60264ceb317ee800";
    var PHOTOS;
    var INDEX = 0;
    //initialize global variables ends ------------------

    //Functions to use more than once initializations starts -------------------------------------------

    //Function loads images for chosen page
    function loadPage(page, tags) {
        var showData = $("#search-result");
        console.info(tags);
        //custom link for chosen page
        var link = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=" + KEY +
            "&tags=" + tags + "&per_page=40&page=" + page + "&format=json&nojsoncallback=1";

        $.get(link, function (data) {
            console.info(data);
            //handle error when status failed
            if(data.stat !== "fail"){
                MAX_PAGES = data.photos.pages;
                PHOTOS = data.photos.photo;
                var len = PHOTOS.length;
                $("#text-search1").val(tags);
                showData.empty();

                $("#boot-pag").bootpag({total: MAX_PAGES});

                //handle error when empty result retrieved
                if(len !== 0){
                    var list = "";
                    //load images in 8 rows and 5 columns format
                    for(var i = 0; i < len/5; i++){
                        var content = "";
                        //load retrieved photos into a variable
                        for(var j = 0; j < 5; j++){
                            var index = 5 * i + j;
                            var farm_id = PHOTOS[index].farm;
                            var server_id = PHOTOS[index].server;
                            var id = PHOTOS[index].id;
                            var secret = PHOTOS[index].secret;
                            //custom link for each image
                            var img_link = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg";
                            content += '<img src="' + img_link + '" class="img-show-info" id=' + id + ' style="width: 100%"/>';
                        }
                        list += '<div class="column">' + content + '</div>';
                    }
                    //display retrieved images
                    $("#boot-pag").show();
                    $("#div-loading").hide();
                    showData.append(list);

                    //show no image if result is empty
                    if(len === 0){
                        var content1 = '<p>No data for tag ' + tags + '</p>';
                        showData.append(content1);
                    }
                }else{
                    $("#div-loading").text('No image found for the tag ' + tags).show();
                    $("#boot-pag").hide();
                }
            }else{
                $("#boot-pag").hide();
                $("#div-loading").text('Failed to load image. Caused by: ' + data.message);
            }

        });
        //display loading message until function $.get callback
        $("#div-loading").text('Loading images from https://www.flickr.com/');
    }

    //Function retrieves JSON data for given tag
    function searchAction(type) {
        var tags;
        if(type === 1){
            tags = $("#text-search").val();
        }else{
            tags = $("#text-search1").val();
        }
        //do operation only if tag is provided
        if(tags !== ""){
            $("#div-search").hide();
            loadPage(1, tags);
            //initialize pagination
            $("#boot-pag").bootpag({
                total: MAX_PAGES,
                page: 1,
                maxVisible: 5,
                first: '←',
                last: '→',
                leaps: true,
                firstLastUse: true
            }).on("page", function(event, num){
                loadPage(num, tags);
            });
        }else{
            alert("Enter tag to search");
        }

    }

    //Function loads current, next or previous photo to the modal
    function loadAnotherImage(index) {
        var farm_id = PHOTOS[index].farm;
        var server_id = PHOTOS[index].server;
        var id = PHOTOS[index].id;
        var secret = PHOTOS[index].secret;
        //link to get original image
        var img_link = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg";
        //link to get image description
        var link_info = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+ KEY +
            "&photo_id=" + id + "&format=json&nojsoncallback=1";

        $.get(link_info, function (data) {
            var img_title = data.photo.title._content;
            var img_location = data.photo.location;
            var img_country, img_place, img_region;
            //check title and location information is provided
            if(img_title === undefined){
                img_title = "No title";
            }
            if(img_location === undefined){
                img_country = "No country info";
                img_place = "No place info";
                img_region = "No region info";
            }else{
                img_country = img_location.country._content;
                img_place = img_location.locality._content;
                img_region = img_location.region._content;
            }
            //change content of modal and display it
            $("#modal-img-title").text(img_title);
            $("#modal-img-source").html("<img src='" + img_link + "'>");
            $("#modal-img-desc").html("<p>Country: " + img_country + "</p>" +
                "<p>Region: " + img_region + "</p>" +
                "<p>Place: " + img_place + "</p>");
            $("#modal-img-info").modal("show");
        });

    }
    //Functions to use more than once initializations ends -------------------------------------------


    //click events initialization starts -------------------------------------
    $("#btn-search").click(function(){
        searchAction(1);
    });

    $("#btn-search1").click(function(){
        MAX_PAGES = 6;
        searchAction(2);
    });

    $(document).on('click','.img-show-info',function(){
        var len = PHOTOS.length;
        for(var i = 0; i < len; i++){
            if(this.id === PHOTOS[i].id){
                INDEX = i;
            }
        }
        console.info("index: " + INDEX);
        loadAnotherImage(INDEX);
    });

    $("#modal-img-next").click(function () {
        //simulate next image as row
        //in reality photos are located by column
        if(INDEX !== 39){
            if(INDEX > 34){
                INDEX = (INDEX + 1) % 35;
            }else{
                INDEX += 5;
            }
        }
        loadAnotherImage(INDEX);
    });

    $("#modal-img-prev").click(function () {
        //simulate prev image as row
        //in reality photos are located by column
        if(INDEX !== 0){
            if(INDEX < 5){
                INDEX = INDEX - 1 + 35;
            }else{
                INDEX -= 5;
            }
        }
        loadAnotherImage(INDEX);
    });
    //click events initialization ends -------------------------------------
});

/*
Phliker
Key:
a8a36cee073bf89c60264ceb317ee800

Secret:
f7451d3cec375cdc
 */