//Light-Dark mode function
$(document).ready(function() {
    // Function to toggle dark mode
    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
        $('.navbar').toggleClass('navbar-light bg-light navbar-dark bg-dark');
        $('.modal-content').toggleClass('modal-dark');
    }

    // Click handler for the toggle button
    $('#toggleButton').click(function() {
        toggleDarkMode();
    });
});





//Contact form submission + pop-up functionality
$(document).ready(function() {
    $('#contactForm').on('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
                
        // Capture form data
        const name = $('#name').val();
        const email = $('#email').val();
        const subject = $('#subject').val();
        const message = $('#message').val();
                
        // Display data in the modal
        $('#modalName').text(name);
        $('#modalEmail').text(email);
        $('#modalSubject').text(subject);
        $('#modalMessage').text(message);
                
        // Show the modal
        $('#submissionModal').modal('show');
                
		// Optionally, reset the form
        $(this).trigger('reset');
    });
});	
	