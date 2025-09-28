document.addEventListener('DOMContentLoaded', function() {
    const tbody = document.getElementById('reservations-tbody');

    fetch('http://localhost:3000/api/dashboard-data')
        .then(response => response.json())
        .then(result => {
            if (result.success && result.data) {
                if (result.data.length === 0) {
                    const row = tbody.insertRow();
                    const cell = row.insertCell();
                    cell.colSpan = 4;
                    cell.textContent = 'まだ予約はありません。';
                    cell.style.textAlign = 'center';
                    return;
                }

                result.data.forEach(reservation => {
                    const row = tbody.insertRow();
                    
                    // Format timestamp
                    const timestamp = new Date(reservation.timestamp).toLocaleString('ja-JP');

                    row.insertCell().textContent = timestamp;
                    row.insertCell().textContent = reservation.reservation_date;
                    row.insertCell().textContent = reservation.user_name;
                    row.insertCell().textContent = reservation.user_id;
                });
            } else {
                console.error('Failed to load dashboard data:', result.error);
                const row = tbody.insertRow();
                const cell = row.insertCell();
                cell.colSpan = 4;
                cell.textContent = 'データの読み込みに失敗しました。';
                cell.style.textAlign = 'center';
            }
        })
        .catch(error => {
            console.error('Error fetching dashboard data:', error);
            const row = tbody.insertRow();
            const cell = row.insertCell();
            cell.colSpan = 4;
            cell.textContent = 'サーバーとの通信に失敗しました。';
            cell.style.textAlign = 'center';
        });
});
