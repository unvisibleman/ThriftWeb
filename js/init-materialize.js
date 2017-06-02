;(function ($) {
    $(function () {

        $('.button-collapse').sideNav();
        $('.parallax').parallax();
        $('.modal').modal({
            complete: function() {
                var form = document.querySelector('#item-params');
                form.reset();
            }
        });
        $('select').material_select();
        $('.datepicker').pickadate({
            selectMonths: true,
            selectYears: 5
        });

    });
})(jQuery);