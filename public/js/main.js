$(document).ready(function () {
    // Math tutors AJAX request
    $('#math-btn').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/display-tutors',
            data: {
                subject: 'math'
            },
            success: function (tutors) {
                $("#math-tutors").empty().append('<h5 class="mb-3">Choose a tutor</h5>');
                $.each(tutors, function (index, tutor) {
                    $("#math-tutors").append('<a href="/schedule-session/' + tutor.banner_id +
                        '" class="text-secondary">' + tutor.first_name + ' ' + tutor.last_name + '</a>');
                });
            }
        });
    });


    // Science tutors AJAX request
    $('#science-btn').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/display-tutors',
            data: {
                subject: 'science'
            },
            success: function (tutors) {
                $("#science-tutors").empty().append('<h5 class="mb-3">Choose a tutor</h5>');
                $.each(tutors, function (index, tutor) {
                    $("#science-tutors").append('<a href="/schedule-session/' + tutor.banner_id +
                        '" class="text-secondary">' + tutor.first_name + ' ' + tutor.last_name + '</a>');
                });
            }
        });
    });


    // Engineering tutors AJAX request
    $('#engineering-btn').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/display-tutors',
            data: {
                subject: 'engineering'
            },
            success: function (tutors) {
                $("#engineering-tutors").empty().append('<h5 class="mb-3">Choose a tutor</h5>');
                $.each(tutors, function (index, tutor) {
                    $("#engineering-tutors").append('<a href="/schedule-session/' + tutor.banner_id +
                        '" class="text-secondary">' + tutor.first_name + ' ' + tutor.last_name + '</a>');
                });
            }
        });
    });


    // Business tutors AJAX request
    $('#business-btn').on('click', function () {
        $.ajax({
            type: 'GET',
            url: '/display-tutors',
            data: {
                subject: 'business'
            },
            success: function (tutors) {
                $("#business-tutors").empty().append('<h5 class="mb-3">Choose a tutor</h5>');

                $.each(tutors, function (index, tutor) {
                    $("#business-tutors").append('<a href="/schedule-session/' + tutor.banner_id +
                        '" class="text-secondary">' + tutor.first_name + ' ' + tutor.last_name + '</a>');
                });
            }
        });
    });
});