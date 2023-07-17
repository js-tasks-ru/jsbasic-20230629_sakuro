function highlight(table) {
  const rows = table.querySelectorAll('tbody tr');

  rows.forEach((row) => {
    const statusCell = row.querySelector('td[data-available]');
    const genderCell = row.querySelector('td:nth-child(3)');
    const ageCell = row.querySelector('td:nth-child(2)');

    if (statusCell) {
      const available = statusCell.dataset.available === 'true';
      row.classList.toggle('available', available);
      row.classList.toggle('unavailable', !available);
    } else {
      row.hidden = true;
    }

    if (genderCell) {
      const gender = genderCell.textContent.trim().toLowerCase();
      row.classList.toggle('male', gender === 'm');
      row.classList.toggle('female', gender === 'f');
    }

    if (ageCell) {
      const age = parseInt(ageCell.textContent, 10);
      if (age < 18) {
        row.style.textDecoration = 'line-through';
      }
    }
  });
}
