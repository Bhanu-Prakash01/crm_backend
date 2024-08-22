document.addEventListener('DOMContentLoaded', () => {
    fetch('/data/stats')
        .then(response => response.json())
        .then(data => {
            const dateSelect = document.getElementById('date-select');
            const tableBody = document.getElementById('data-entries');
            const totalEntriesElement = document.getElementById('total-entries');
            const recordDetailsSection = document.getElementById('record-details');
            const detailsContainer = document.getElementById('details-container');
            const usernameSearch = document.getElementById('username-search');
            const autocompleteList = document.getElementById('autocomplete-list');

            // Extract unique dates and usernames
            const uniqueDates = [...new Set(data.map(entry => entry._id.date))];
            const usernames = [...new Set(data.map(entry => entry.user_info.username.toLowerCase()))];

            uniqueDates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = date;
                dateSelect.appendChild(option);
            });

            // Function to render table data based on the selected date and username
            function renderTable(selectedDate, searchUsername) {
                tableBody.innerHTML = ''; // Clear the table

                let filteredData;
                if (searchUsername) {
                    filteredData = data.filter(entry => 
                        entry.user_info.username.toLowerCase().includes(searchUsername.toLowerCase())
                    );
                } else {
                    filteredData = data.filter(entry => entry._id.date === selectedDate);
                }

                // Calculate the total number of entries
                const totalEntries = filteredData.reduce((sum, entry) => sum + entry.count, 0);
                totalEntriesElement.textContent = `Total Entries: ${totalEntries}`;

                filteredData.forEach(entry => {
                    const row = document.createElement('tr');

                    // Date
                    const dateCell = document.createElement('td');
                    dateCell.textContent = entry._id.date;
                    row.appendChild(dateCell);

                    // Username
                    const usernameCell = document.createElement('td');
                    usernameCell.textContent = entry.user_info.username;
                    row.appendChild(usernameCell);

                    // Entry Count
                    const countCell = document.createElement('td');
                    countCell.textContent = entry.count;
                    row.appendChild(countCell);

                    // Records (Clickable to view details)
                    const recordsCell = document.createElement('td');
                    const viewDetailsButton = document.createElement('button');
                    viewDetailsButton.textContent = 'View Details';
                    viewDetailsButton.classList.add('view-details-button');
                    viewDetailsButton.addEventListener('click', () => {
                        toggleRecordDetails(entry.records, viewDetailsButton);
                    });
                    recordsCell.appendChild(viewDetailsButton);
                    row.appendChild(recordsCell);

                    tableBody.appendChild(row);
                });
            }

            // Function to toggle detailed records
            function toggleRecordDetails(records, button) {
                // Clear previous details
                detailsContainer.innerHTML = ''; 

                if (recordDetailsSection.classList.contains('hidden')) {
                    // Show details
                    records.forEach(record => {
                        const recordDiv = document.createElement('div');
                        recordDiv.classList.add('record-detail');

                        recordDiv.innerHTML = `
                            <p><strong>Company Name:</strong> ${record.company_name}</p>
                            <p><strong>URL:</strong> <a href="${record.url}" target="_blank">${record.url}</a></p>
                            <p><strong>Email:</strong> ${record.email}</p>
                            <p><strong>Phone:</strong> ${record.phone}</p>
                            <p><strong>Handles:</strong> ${record.handles}</p>
                            <p><strong>Source:</strong> ${record.source}</p>
                        `;

                        detailsContainer.appendChild(recordDiv);
                    });
                    recordDetailsSection.classList.remove('hidden'); // Show the details section
                    button.textContent = 'Hide Details'; // Change button text to Hide Details
                } else {
                    // Hide details
                    recordDetailsSection.classList.add('hidden');
                    button.textContent = 'View Details'; // Change button text back to View Details
                }
            }

            // Function to show autocomplete suggestions
            function showAutocompleteSuggestions(value) {
                autocompleteList.innerHTML = ''; // Clear previous suggestions
                if (value.length > 0) {
                    const filteredUsernames = usernames.filter(username => username.includes(value.toLowerCase()));
                    filteredUsernames.forEach(username => {
                        const li = document.createElement('li');
                        li.textContent = username;
                        li.addEventListener('click', () => {
                            usernameSearch.value = username;
                            autocompleteList.classList.add('hidden');
                            renderTable(null, username); // Fetch all records for the selected username
                        });
                        autocompleteList.appendChild(li);
                    });
                    autocompleteList.classList.remove('hidden');
                } else {
                    autocompleteList.classList.add('hidden');
                }
            }

            // Initial render with the first date
            if (uniqueDates.length > 0) {
                renderTable(uniqueDates[0], '');
            }

            // Event listener for date selection
            dateSelect.addEventListener('change', (event) => {
                renderTable(event.target.value, usernameSearch.value);
                recordDetailsSection.classList.add('hidden'); // Hide details section when date changes
            });

            // Event listener for username search input
            usernameSearch.addEventListener('input', (event) => {
                showAutocompleteSuggestions(event.target.value);
            });

            // Hide autocomplete list when clicking outside
            document.addEventListener('click', (event) => {
                if (!autocompleteList.contains(event.target) && event.target !== usernameSearch) {
                    autocompleteList.classList.add('hidden');
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
