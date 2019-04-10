$(document).ready(function () {

    $('#day-select').change(function () {

        let tutorId = $('#hidden-tutor-id').val();
        let day = this.value;
        console.log("ID: " + tutorId);
        $.ajax({
            type: 'GET',
            url: '/update-time',
            data: {
                tutor_id: tutorId,
                day: day
            },
            success: function (times) {
                $("#start-time-select").empty().append('<option>Choose...</option>');
                $.each(times, function (index, time) {
                    $("#start-time-select").append('<option>' + time.start_time + '</option>');
                });
            }
        });
    });
});