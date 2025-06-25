document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.nav-item.dropdown');

    dropdown.addEventListener('mouseenter', () => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'block';
    });

    dropdown.addEventListener('mouseleave', () => {
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        dropdownMenu.style.display = 'none';
    });
});
