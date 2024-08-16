document.addEventListener('DOMContentLoaded', () => {
    fetch('/data/stats')
        .then(response => response.json())
        .then(data => {
            const dateSelect = document.getElementById('date-select');
            const tableBody = document.getElementById('data-entries');
            const totalEntriesElement = document.getElementById('total-entries');
            const recordDetailsSection = document.getElementById('record-details');
            const detailsContainer = document.getElementById('details-container');
            const closeDetailsButton = document.getElementById('close-details');

            // Extract unique dates and populate the dropdown
            const uniqueDates = [...new Set(data.map(entry => entry._id.date))];
            uniqueDates.forEach(date => {
                const option = document.createElement('option');
                option.value = date;
                option.textContent = date;
                dateSelect.appendChild(option);
            });

            // Function to render table data and total entries based on the selected date
            function renderTable(selectedDate) {
                tableBody.innerHTML = ''; // Clear the table
                const filteredData = data.filter(entry => entry._id.date === selectedDate);
                
                // Calculate the total number of entries for the selected date
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
                    viewDetailsButton.addEventListener('click', () => {
                        showRecordDetails(entry.records);
                    });
                    recordsCell.appendChild(viewDetailsButton);
                    row.appendChild(recordsCell);

                    tableBody.appendChild(row);
                });
            }

            // Function to show detailed records for a selected entry
            function showRecordDetails(records) {
                detailsContainer.innerHTML = ''; // Clear previous details
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
            }

            // Close the details section
            closeDetailsButton.addEventListener('click', () => {
                recordDetailsSection.classList.add('hidden'); // Hide the details section
            });

            // Initial render with the first date
            if (uniqueDates.length > 0) {
                renderTable(uniqueDates[0]);
            }

            // Event listener for date selection
            dateSelect.addEventListener('change', (event) => {
                renderTable(event.target.value);
                recordDetailsSection.classList.add('hidden'); // Hide details section when date changes
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
