$(document).ready(function() {
    // Check if dark mode is set in cookies
    if (Cookies.get('darkMode') === 'true') {
        $('body').addClass('dark-mode');
        $('#toggleButton').text('Disable Dark Mode');
        $('.navbar').removeClass('navbar-light bg-light').addClass('navbar-dark bg-dark');
        $('.modal-content').addClass('modal-dark');
        // Dark mode styles for footer
        $('footer').removeClass('bg-light').addClass('bg-dark text-white');
        $('footer a').removeClass('text-muted').addClass('text-white');
    }

    // Function to toggle dark mode
    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
        const button = $('#toggleButton');
        button.text(button.text() === 'Enable Dark Mode' ? 'Disable Dark Mode' : 'Enable Dark Mode');
        $('.navbar').toggleClass('navbar-light bg-light navbar-dark bg-dark');
        $('.modal-content').toggleClass('modal-dark');
        
        // Dark mode styles for footer
        $('footer').toggleClass('bg-light bg-dark text-white');
        $('footer a').toggleClass('text-muted text-white');

        // Set the cookie based on the dark mode state
        Cookies.set('darkMode', $('body').hasClass('dark-mode'), { expires: 7 }); // Expires in 7 days
    }

    // Click handler for the toggle button
    $('#toggleButton').click(function() {
        toggleDarkMode();
    });
});




// Contact form submission + pop-up functionality
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

// Task Management functionalities
$(document).ready(function() {
    // Function to load tasks from cookies
    function loadTasks() {
        const tasks = JSON.parse(Cookies.get('tasks') || '[]');
        tasks.forEach(task => {
            const taskRow = 
                `<tr class="task-row">
                    <td>${task.name}</td>
                    <td>${task.description}</td>
                    <td>${task.dueDate}</td>
                    <td class="status"><span class="badge badge-secondary">${task.status}</span></td>
                    <td>
                        <button class="btn btn-secondary action-button" data-toggle="modal" data-target="#taskModal">Actions</button>
                    </td>
                </tr>`;
            $('#task-list').append(taskRow);
        });
    }

    // Function to save tasks to cookies
    function saveTasks() {
        const tasks = [];
        $('.task-row').each(function() {
            const name = $(this).find('td:eq(0)').text();
            const description = $(this).find('td:eq(1)').text();
            const dueDate = $(this).find('td:eq(2)').text();
            const status = $(this).find('.status').text().trim();
            tasks.push({ name, description, dueDate, status });
        });
        Cookies.set('tasks', JSON.stringify(tasks), { expires: 7 }); // Set the cookie to expire in 7 days
    }

    // Load tasks on page load
    loadTasks(); // Load tasks from cookies when the page is loaded

    // Add Task
    $('#task-form').on('submit', function(e) {
        e.preventDefault();

        const taskName = $('#taskName').val();
        const taskDescription = $('#taskDescription').val();
        const taskDueDate = $('#taskDueDate').val();

        // Create the task row
        const taskRow = `
            <tr class="task-row">
                <td>${taskName}</td>
                <td>${taskDescription}</td>
                <td>${taskDueDate}</td>
                <td class="status"><span class="badge badge-secondary">Pending</span></td>
                <td>
                    <button class="btn btn-secondary action-button" data-toggle="modal" data-target="#taskModal">Actions</button>
                </td>
            </tr>
        `;
        
        // Append the task row to the task list
        $('#task-list').append(taskRow);

        // Reset the form
        $('#task-form')[0].reset(); 

        // Save the updated task list to cookies
        saveTasks(); 
        logActivity(`Task "${taskName}" added.`);
    });

    $(document).on('click', '.action-button', function() {
        const row = $(this).closest('tr');
        $('#taskModal').data('row', row); // Store the row for later reference
    });

    // Filter Tasks
    $('#filterStatus').on('change', function() {
        const filterValue = $(this).val();
        $('.task-row').show(); // Show all initially

        if (filterValue === 'completed') {
            $('.task-row').filter(function() {
                return $(this).find('.status').text().trim() !== 'Completed';
            }).hide();
        } else if (filterValue === 'pending') {
            $('.task-row').filter(function() {
                return $(this).find('.status').text().trim() === 'Completed';
            }).hide();
        }
    });

    // Sort Tasks
    $('#sortTasks').on('change', function() {
        const sortBy = $(this).val();
        const rows = $('#task-list .task-row');

        rows.sort(function(a, b) {
            const aText = sortBy === 'name' ? $(a).find('td:eq(0)').text() : new Date($(a).find('td:eq(2)').text());
            const bText = sortBy === 'name' ? $(b).find('td:eq(0)').text() : new Date($(b).find('td:eq(2)').text());

            return aText > bText ? 1 : -1;
        });

        $('#task-list').empty().append(rows); // Append sorted rows back to the table
    });

    // Complete Task
    $(document).on('click', '.complete-task', function() {
        const row = $('#taskModal').data('row');
        row.find('.status').html('<span class="badge badge-success">Completed</span>');
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${row.find('td:eq(0)').text()}" marked as completed.`);
    });

    // Edit Task
    $(document).on('click', '.edit-task', function() {
        const row = $('#taskModal').data('row');
        const taskName = row.find('td:eq(0)').text();

        $('#taskName').val(taskName);
        $('#taskDescription').val(row.find('td:eq(1)').text());
        $('#taskDueDate').val(row.find('td:eq(2)').text());
        row.remove();
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${taskName}" edited.`);
    });

    // Delete Task
    $(document).on('click', '.delete-task', function() {
        const row = $('#taskModal').data('row');
        const taskName = row.find('td:eq(0)').text();
        row.remove();
        $('#taskModal').modal('hide');
        saveTasks(); // Save updated tasks to cookies
        logActivity(`Task "${taskName}" deleted.`);
    });

    // Function to load latest tasks from cookies
    function loadLatestTasks() {
        const tasks = JSON.parse(Cookies.get('tasks') || '[]');
        if (tasks.length === 0) {
            $('#latest-task').html('<p>No recent tasks found.</p>');
            return;
        }

        const latestTasks = tasks.slice(-3); // Get the last 3 tasks
        const taskList = latestTasks.map(task => `
            <div class="alert alert-info">
                <strong>${task.name}</strong><br />
                <em>${task.description}</em><br />
                Due Date: ${task.dueDate}<br />
                Status: <span class="badge badge-secondary">${task.status}</span>
            </div>
        `).join('');

        $('#latest-task').html(taskList);
    }

    // Function to log activity
    function logActivity(activity) {
        const activities = JSON.parse(Cookies.get('activities') || '[]');
        activities.push({ activity, time: new Date().toLocaleString() });
        Cookies.set('activities', JSON.stringify(activities), { expires: 7 }); // Store activities in cookies
        loadLatestActivities(); // Update latest activities display
    }

    // Function to load latest activities
    function loadLatestActivities() {
        const activities = JSON.parse(Cookies.get('activities') || '[]');
        if (activities.length === 0) {
            $('#latest-activity-list').html('<p>No recent activities found.</p>');
            return;
        }

        const latestActivities = activities.slice(-3); // Get the last 3 activities
        const activityList = latestActivities.map(activity => `
            <div class="alert alert-light">
                <strong>${activity.time}:</strong> ${activity.activity}
            </div>
        `).join('');

        $('#latest-activity-list').html(activityList); // Update the correct element
    }

    // Load latest tasks and activities on homepage
    loadLatestTasks(); // Call this function to populate the latest tasks
    loadLatestActivities(); // Call this function to populate the latest activities
});
