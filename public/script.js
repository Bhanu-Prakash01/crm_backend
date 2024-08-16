document.addEventListener('DOMContentLoaded', () => {
    fetch('/data/stats')
        .then(response => response.json())
        .then(data => {
            const dateSelect = document.getElementById('date-select');
            const tableBody = document.getElementById('data-entries');
            const totalEntriesElement = document.getElementById('total-entries');

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

                    // Records
                    const recordsCell = document.createElement('td');
                    recordsCell.textContent = entry.records.length; // Show number of records
                    row.appendChild(recordsCell);

                    tableBody.appendChild(row);
                });
            }

            // Initial render with the first date
            if (uniqueDates.length > 0) {
                renderTable(uniqueDates[0]);
            }

            // Event listener for date selection
            dateSelect.addEventListener('change', (event) => {
                renderTable(event.target.value);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
