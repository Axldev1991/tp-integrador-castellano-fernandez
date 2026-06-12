document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeCircle = document.getElementById('themeCircle');

    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        themeCircle.classList.remove('light');
        themeCircle.classList.add('dark');
    } else {
        themeCircle.classList.add('light');
        themeCircle.classList.remove('dark');
    }

    const toggleTheme = () => {
        if (document.body.classList.contains('dark')) {
            // Tema claro
            document.body.classList.remove('dark');
            themeCircle.classList.remove('dark');
            themeCircle.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            // Oscuro
            document.body.classList.add('dark');
            themeCircle.classList.remove('light');
            themeCircle.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    themeToggle.addEventListener('click', toggleTheme);
});