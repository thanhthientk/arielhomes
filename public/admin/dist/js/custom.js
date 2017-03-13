$(window).ready(function(){

    $('span.time').each(function() {
        var item = $(this);
        var time = item.data('time'),
            format = item.data('format');
        item.html(moment(time).format(format));
    });

    var deleteButton = $('#multipleDelete-btn'),
        mainTable = $('table.main-table'),
        tdCheckbox = mainTable.find('td input[type=checkbox]');
    var changeDeleteButtonStatus = function (status) {
        if (status) {
            deleteButton.removeClass('disabled');
        } else {
            deleteButton.addClass('disabled');
        }
    };
    mainTable.find('thead th:first-child input[type=checkbox]').on('change', function() {
        tdCheckbox.prop('checked', $(this).prop('checked'));
    });

    mainTable.find('input[type=checkbox]').on('change', function () {
        var hasCheckboxChecked = false;
        tdCheckbox.each(function() {
            if ($(this).prop('checked') === true){
                return hasCheckboxChecked = true;
            }
        });
        changeDeleteButtonStatus(hasCheckboxChecked);
    });

    deleteButton.on('click', function () {
        $('#multipleDelete').submit();
    });

    //date range picker
    $('.date-range-picker').each(function() {
        $(this).dateRangePicker({
            format: 'DD/MM/YYYY',
            separator: ' - '
        });
    });

    //submit main form
    $('#submitMainForm').on('click', function () {
        $('#main-form').submit();
    });

});