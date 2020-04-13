(function($) {
$(function() {
  console.log('rv js.');
  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  console.log(iOS);
  //$('.et_pb_section_first').css('padding-top', '20px !important');
  // wheelbase
  var rvID;
  var query = window.location.search.substring(1);
  var pathName = window.location.pathname;
  var pathArray = pathName.split('/');
  var pathRVID = pathArray[2];
  console.log(pathRVID);
  var vars = query.split("&");
  var pair = vars[0].split("=");
  var rvData;
  var video = false;
  var videoUrl = '';
  var wheelbase = Wheelbase({
    accountId: 79,
    urlParams: true
   });
  console.log(vars);
  var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  console.log(isSafari);

  if( pair[0] === 'id' || pathRVID ) {
    rvID = pair[0] === 'id' ? pair[1] : pathRVID;
    var urlQ = "https://api.outdoorsy.co/v0/rentals/"+rvID;
    $.get( urlQ, function( data ) {
      rvData = data;
      rvData.images.forEach(function(element) {
        if(element.video){
          video = true;
          videoUrl = element.url.replace("youtu.be","youtube.com/embed");
        }
      });
      template();
      wheelbaseFunction();
      //$('#booking-name').text(rvData.name);
      //$('#booking-year').text(rvData.vehicle.year);

      var sortedImages = sortByKey(rvData.images, 'position');
      sortedImages = sortedImages.reverse();
      var imageDivWidth = $('.rv-slider').width();
      var newHeight = imageDivWidth * .666;

      $('.rv-slider .slides').css('height', newHeight);

      $('.rv-slider .slides').append('<li class="slide active"><img style="height:'+newHeight+'px;" src="'+rvData.primary_image_url+'" /></li>');


      for (let i = sortedImages.length -1; i > -1; i--) {
        console.log(sortedImages[i]);
        if (!sortedImages[i].video) {
          $('.rv-slider .slides').append('<li class="slide"><img style="height:'+newHeight+'px;" src="'+sortedImages[i].url+'" /></li>');
        }
      }
      /*
      $( ".rv-slider .slides .slide img" ).each(function() {
        let thisImg = $(this);
        let width = thisImg.width()/.666;
        thisImg.css('height', width);
      });
      */
    });
  } else {
    alert('RV Not Found, Please Check Your Link.');
    rvID = 0;
  }

  function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = a[key]; var y = b[key];
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
  }

  function template() {

    // Grab the template script
    var templateScript = $("#rv-template").html();

    // Compile the template
    var theTemplate = Handlebars.compile(templateScript);

    console.log(rvData);
    var dollars = Number(rvData.active_price.day);
    dollars = dollars / 100;
    dollars.toLocaleString("en-US", {style:"currency", currency:"USD"});
    var newDescription = rvData.description.replace(/(\r\n|\n|\r)/gm, "<br />");

    // Define our data object
    var context= {
      "name": rvData.name,
      "title": rvData.summary,
      "image": rvData.primary_image_url,
      "description": newDescription,
      "model": rvData.vehicle.model,
      "make": rvData.vehicle.make,
      "length": rvData.vehicle.length,
      "height": rvData.vehicle.height,
      "class": rvData.type,
      "sleeps": rvData.sleeps,
      "day_price": dollars,
      "air_conditioner": rvData.features.air_conditioner,
      "bike_rack": rvData.features.bike_rack,
      "audio_inputs": rvData.features.audio_inputs,
      "awning": rvData.features.awning,
      "backup_camera": rvData.features.backup_camera,
      "cd_player":  rvData.features.cd_player,
      "ceiling_fan": rvData.features.ceiling_fan,
      "dining_table": rvData.features.dining_table,
      "extra_storage": rvData.features.extra_storage,
      "fuel_tank": rvData.features.fuel_tank,
      "fuel_type": rvData.features.fuel_type,
      "generator": rvData.features.generator,
      "gray_tank": rvData.features.gray_tank,
      "handicap_accessible": rvData.features.handicap_accessible,
      "heater": rvData.features.heater,
      "hot_water_tank": rvData.features.hot_water_tank,
      "inside_shower": rvData.features.inside_shower,
      "inverter": rvData.features.inverter,
      "kitchen_sink": rvData.features.kitchen_sink,
      "leveling_jacks": rvData.features.leveling_jacks,
      "microwave": rvData.features.microwave,
      "minimum_age":null,
      "mpg":14,
      "one_way_rentals":false,
      "outside_shower": rvData.features.outside_shower,
      "oven": rvData.features.oven,
      "pet_friendly": rvData.features.pet_friendly,
      "propane_tank": rvData.features.propane_tank,
      "radio": rvData.features.radio,
      "refrigerator": rvData.features.refrigerator,
      "satellite": rvData.features.satellite,
      "sewage_tank": rvData.features.sewage_tank,
      "skylight": rvData.features.skylight,
      "slide_outs":1,
      "smoking_allowed": rvData.features.smoking_allowed,
      "solar": rvData.features.solar,
      "stove": rvData.features.stove,
      "tailgate_friendly": rvData.features.tailgate_friendly,
      "toilet": rvData.features.toilet,
      "tow_hitch": rvData.features.tow_hitch,
      "trailer_weight":null,
      "transmission": "automatic",
      "tv_dvd": rvData.features.tow_hitch,
      "video": video,
      "videoUrl": videoUrl +"?rel=0",
      "washer_dryer": rvData.features.washer_dryer,
      "water_tank": rvData.features.water_tank,
      "wifi": rvData.features.wifi
    };

    // Pass our data to the template
    var compiledHtml = theTemplate(context);

    // Add the compiled html to the page
    $('#rv-placeholder').html(compiledHtml);
  }

  function wheelbaseFunction(){


  var addonsTemplate = document.getElementById("addons-template").innerHTML;

   wheelbase.addWidget(wheelbase.widgets.AddonList, "addons-container", {
       rentalId: rvID, //your rental ID, required
       template: addonsTemplate,
       filter: function(addon){
        //  console.log(addon);
         return addon.available;
       }
    });

    wheelbase.addWidget(wheelbase.widgets.DateRange, "date-container", {
       rentalId: rvID
     });

     wheelbase.addWidget(wheelbase.widgets.DateRange, "availability-calendar-container", {
          rentalId: rvID,
          embedded: true,
          numberOfMonths: 2 // optional
      });



    wheelbase.addWidget(wheelbase.widgets.Quote, "quote-container", {
       rentalId: rvID, //your rental ID
       template: {
        error: "{{error}}",
        noQuote: "before-quote-entered",
        quote: function(quote) {
          console.log(quote);
            return "quote received";
        }
       },
       cssClasses: {
           root: "base-class",
           lineItem: "wheelbase-line-item",
           lineItemDescription: "wheelbase-line-item-description",
           lineItemPrice: "wheelbase-line-item-price",
           lineTotal: "wheelbase-line-total",
           lineSubtotal: "wheelbase-line-subtotal",
           lineTax: "wheelbase-line-tax",
           lineServiceFee: "wheelbase-line-service-fee",
           error: "wheelbase-quote-error"
       }
   });


    wheelbase.start();

    $(document).on('click', '.add-addon', function(e) {
        e.preventDefault();
        let aid = $(this).data('id'),
            available = $(this).data('available'),
            selected = $(this).siblings('.selected-addons').val();

        if (selected < available) {
          selected++
          $(this).siblings('.selected-addons').val(selected);
          wheelbase.addAddon(aid, selected);
        }

    });

    $(document).on('click', '.remove-addon', function(e) {
        e.preventDefault();
        let aid = $(this).data('id'),
            available = $(this).data('available'),
            selected = $(this).siblings('.selected-addons').val();

        if (selected > 0) {
          selected--
          $(this).siblings('.selected-addons').val(selected);
          wheelbase.addAddon(aid, selected);
        }

    });

  }

 $(document).on('click', '#book-button', function(e) {
   e.preventDefault();
   var em = $('#bookemail').val();
   console.log(em);
   console.log(rvID);
   wheelbase.startBooking({
        email: em,
        rentalId: rvID,
        source: 'adventurekt.com'
    }).then(function(url, bookingDetails) {
        ga('send', 'event', 'RV', 'book');
        window.location.href = url;
        /*
        if(iOS) {
          window.location.href = url;
        } else {
          $('#book-now-frame').attr('src', url);
          $('#book-now-container').addClass('visible');
          $('#main-footer, #booking-row').css('display','none');
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          $('body').css('overflow','hidden');
          document.getElementById('book-now-frame').onload = function(){
              var iframeBody = this.contentDocument.body;
              console.log('iframe loaded, body is: ', body);
          };
        }
        */
    }).catch(function(error) {
        alert("There was an error creating your reservation: " + error);
    });
 });

 // Slider
var active,
    animate = false,
    delay = 750;


$(document).on("click", ".rv-slider .slider-nav", function(e) {
  let t = $(this);
  active = $('.slide.active');

  if (animate === true){
    return false;
  } else {
    animate = true;
  }

  if (t.hasClass("right")) {
    console.log('right');

    let newActive = active.next();
    active.removeClass('active').addClass('prev');
    newActive.addClass('active');
    setTimeout(function(){
      $(".slides .prev").remove().insertAfter($(".slides .slide:last")).removeClass('prev');
      active = newActive;
      animate = false;
    }, delay);
  }

  if (t.hasClass("left")) {
    console.log('left');

    $('.slide.next').removeClass('next');
    $(".slides .slide:last").remove().insertBefore($(".slides .active")).addClass('prev');
    setTimeout(function(){
      let newActive = active.prev();
      active.removeClass('active').addClass('next');
      newActive.addClass('active').removeClass('prev');
      active = newActive;
    }, 1);
    setTimeout(function(){
      animate = false;
    }, delay);
  }
});
window.addEventListener("message", function(e) {
  console.log('message::: ', e);
}, false);
});

})( jQuery );
