var wheelbase = Wheelbase({
    accountId:  720951,
    urlParams: true,
    currency: 'EUR'
});

// Now that we've initialized the app, we can begin enabling the widgets we want

// first we add the widget for displaying results
// To begin, we'll load up the template you included in your page
var resultTemplate = document.getElementById("result-template").innerHTML;
var unavailableTemplate = document.getElementById("unavailable-result-template").innerHTML;
// now add the widget to the page
// we're also providing custom classes, this is completely optional
wheelbase.addWidget(wheelbase.widgets.RentalList, "rental-results", {
    template:resultTemplate,
    unavailable: unavailableTemplate, // optional, will just hide unavailable results if no template provided
    filters:{
        "hidden": true
    },
    cssClasses: {
        root: "custom-result-container",
        singleItem: "custom-result"
    }
});

wheelbase.addWidget(wheelbase.widgets.LocationList, "locations-container", {
    cssClasses: {
        root: "rental-location-container",
        listItem: "rental-location",
        listItemLabel: "rental-location-label"
    },
    template: function(data) {
        //optional
        return "{{label}}";
    }
})

// now lets add the search widgets
wheelbase.addWidget(wheelbase.widgets.TypeList, "vehicle-type", {
    cssClasses: {
        root: "rental-type"
    }
});

// to simplify the process, we'll stop including custom classes, but all
// widgets support them
//wheelbase.addWidget(wheelbase.widgets.PriceRange, "vehicle-price");
wheelbase.addWidget(wheelbase.widgets.DateRange, "date-container", options = {});
wheelbase.addWidget(wheelbase.widgets.SelectFilter, "vehicle-tags");

wheelbase.start();
