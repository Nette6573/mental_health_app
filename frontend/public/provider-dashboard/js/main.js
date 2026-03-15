// Mobile Sidebar Toggle
function toggleMobileSidebar() {
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarContent = document.getElementById('mobile-sidebar-content');
    
    if (mobileSidebar && mobileSidebarContent) {
        const isHidden = mobileSidebar.classList.contains('hidden');
        
        if (isHidden) {
            mobileSidebar.classList.remove('hidden');
            setTimeout(() => {
                mobileSidebarContent.classList.remove('-translate-x-full');
            }, 10);
        } else {
            mobileSidebarContent.classList.add('-translate-x-full');
            setTimeout(() => {
                mobileSidebar.classList.add('hidden');
            }, 300);
        }
    }
}

// Logout Function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // In a real application, this would:
        // 1. Clear authentication tokens
        // 2. Clear session data
        // 3. Redirect to login page
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Close mobile sidebar when clicking outside
document.addEventListener('click', function(e) {
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarContent = document.getElementById('mobile-sidebar-content');
    const hamburgerBtn = document.querySelector('button[onclick="toggleMobileSidebar()"]');
    
    if (mobileSidebar && !mobileSidebar.classList.contains('hidden')) {
        // Check if click is outside sidebar and not on hamburger button
        if (!mobileSidebarContent.contains(e.target) && 
            !hamburgerBtn.contains(e.target) &&
            e.target !== hamburgerBtn) {
            toggleMobileSidebar();
        }
    }
});

// Dark Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    
    // Re-initialize icons to update sun/moon
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Load dark mode preference on page load
function loadDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') {
        document.documentElement.classList.add('dark');
    }
}

// Initialize Lucide icons on page load
document.addEventListener('DOMContentLoaded', function() {
    loadDarkMode();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});