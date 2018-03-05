$(document).ready(function (){
    var MAX_PAGES = 6;
    var KEY = "a8a36cee073bf89c60264ceb317ee800";
    var PHOTOS;
    var INDEX = 0;
    function loadPage(page, tags) {
        var showData = $("#search-result");
        console.info(tags);
        var link = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=" + KEY +
            "&tags=" + tags + "&per_page=40&page=" + page + "&format=json&nojsoncallback=1";

        // console.info("link: " + link);

        $.get(link, function (data, status) {
            MAX_PAGES = data.photos.pages;
            // console.info("Maxpages in func " + max_pages);
            // console.info("status " + status);
            console.info(data);
            PHOTOS = data.photos.photo;
            $("#text-search1").val(tags);
            showData.empty();
            var len = PHOTOS.length;
            var list = "";
            for(var i = 0; i < len/5; i++){
                var content = "";
                for(var j = 0; j < 5; j++){
                    var index = 5 * i + j;
                    var farm_id = PHOTOS[index].farm;
                    var server_id = PHOTOS[index].server;
                    var id = PHOTOS[index].id;
                    var secret = PHOTOS[index].secret;
                    var img_link = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg";
                    content += '<img src="' + img_link + '" class="img-show-info" id=' + id + ' style="width: 100%"/>';
                }
                list += '<div class="column">' + content + '</div>';
            }

            $("#div-loading").hide();
            showData.append(list);

            if(len === 0){
                var content1 = '<p>No data for tag ' + tags + '</p>';
                showData.append(content1);
            }
        });

        $("#div-loading").text('Loading images from https://www.flickr.com/');
    }


    function searchAction(type) {
        var tags;
        if(type === 1){
            tags = $("#text-search").val();
        }else{
            tags = $("#text-search1").val();
        }

        if(tags !== ""){
            $("#div-search").hide();
            loadPage(1, tags);
            console.info(MAX_PAGES);
            $("#boot-pag").bootpag({
                total: MAX_PAGES,
                page: 1,
                maxVisible: 5
            }).on("page", function(event, num){
                $(this).bootpag({total: MAX_PAGES,
                    first: '←',
                    last: '→',
                    leaps: true,
                    firstLastUse: true});
                loadPage(num, tags);
            });
        }else{
            alert("Enter tag to search");
        }

    }

    function loadAnotherImage(index) {
        var farm_id = PHOTOS[index].farm;
        var server_id = PHOTOS[index].server;
        var id = PHOTOS[index].id;
        var secret = PHOTOS[index].secret;
        var img_link = "https://farm" + farm_id + ".staticflickr.com/" + server_id + "/" + id + "_" + secret + ".jpg";
        var link_info = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+ KEY +
            "&photo_id=" + id + "&format=json&nojsoncallback=1";

        $.get(link_info, function (data) {
            var img_title = data.photo.title._content;
            var img_location = data.photo.location;
            var img_country, img_place, img_region;
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

            $("#modal-img-title").text(img_title);
            $("#modal-img-source").html("<img src='" + img_link + "'>");
            $("#modal-img-desc").html("<p>Country: " + img_country + "</p>" +
                "<p>Region: " + img_region + "</p>" +
                "<p>Place: " + img_place + "</p>");
            // $("#modal-img-info").modal("show");
        });

    }

    $("#btn-search").click(function(){
        searchAction(1);
    });
    $("#btn-search1").click(function(){
        MAX_PAGES = 6;
        searchAction(2);
    });

    $(document).on('click','.img-show-info',function(){
        var link_info = "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+ KEY +
            "&photo_id=" + this.id + "&format=json&nojsoncallback=1";
        var link_img = this.src;
        var len = PHOTOS.length;
        for(var i = 0; i < len; i++){
            if(this.id === PHOTOS[i].id){
                INDEX = i;
            }
        }
        console.info("index: " + INDEX);

        $.get(link_info, function (data) {
            console.info(data);

            var img_title = data.photo.title._content;
            var img_location = data.photo.location;
            var img_country, img_place, img_region;

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

            console.info("Title: " + img_title + ";\nCountry: " + img_country + ";\nPlace: " + img_place + ";\nRegion: " + img_region);
            console.info("\nSRC: " + link_img);


            $("#modal-img-title").text(img_title);
            $("#modal-img-source").html("<img src='" + link_img + "'>");
            $("#modal-img-desc").html("<p>Country: " + img_country + "</p>" +
                                      "<p>Region: " + img_region + "</p>" +
                                      "<p>Place: " + img_place + "</p>");
            $("#modal-img-info").modal("show");
        });

    });

    $("#modal-img-next").click(function () {
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
        if(INDEX !== 0){
            if(INDEX < 5){
                INDEX = INDEX - 1 + 35;
            }else{
                INDEX -= 5;
            }
        }
        loadAnotherImage(INDEX);
    });
});

/*
Phliker
Key:
a8a36cee073bf89c60264ceb317ee800

Secret:
f7451d3cec375cdc
 */