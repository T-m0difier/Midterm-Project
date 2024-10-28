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



//Task Management functionality
$(document).ready(function() {
            $('#task-form').on('submit', function(e) {
                e.preventDefault();
                
                const taskName = $('#taskName').val();
                const taskDescription = $('#taskDescription').val();
                const taskDueDate = $('#taskDueDate').val();

                const taskRow = `
                    <tr>
                        <td>${taskName}</td>
                        <td>${taskDescription}</td>
                        <td>${taskDueDate}</td>
                        <td class="status"><span class="badge badge-secondary">Pending</span></td>
                        <td>
							<button class="btn btn-secondary action-button" data-toggle="modal" data-target="#taskModal">Actions</button>
						</td>

                    </tr>
                `;
                $('#task-list').append(taskRow); //add row with the attributes that got collected
                $('#task-form')[0].reset(); //reset form
            });

            $(document).on('click', '.action-button', function() {
				const row = $(this).closest('tr');
				$('#taskModal').data('row', row); // Store the row for later reference
			});

// Complete Task
			$(document).on('click', '.complete-task', function() {
				const row = $('#taskModal').data('row');
				row.find('.status').html('<span class="badge badge-success">Completed</span>');
				$('#taskModal').modal('hide');
			});

// Edit Task
			$(document).on('click', '.edit-task', function() {
				const row = $('#taskModal').data('row');
				$('#taskName').val(row.find('td:eq(0)').text());
				$('#taskDescription').val(row.find('td:eq(1)').text());
				$('#taskDueDate').val(row.find('td:eq(2)').text());
				row.remove();
				$('#taskModal').modal('hide');
			});

// Delete Task
			$(document).on('click', '.delete-task', function() {
				const row = $('#taskModal').data('row');
				row.remove();
				$('#taskModal').modal('hide');
			});

        });