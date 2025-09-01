class TechStudyHub {
    constructor() {
        this.currentSection = 'dashboard';
        this.theme = this.getStoredTheme();
        this.bookmarks = this.getStoredBookmarks();
        this.searchResults = [];
        this.studyProgress = this.getStoredProgress();
        this.charts = {};
        this.isLoading = false;
        this.currentFilter = 'all';
        this.courseData = {};

        this.init();
    }

    async init() {
        console.log('🚀 Initializing Tech Study Hub...');
        await this.loadCourseData();
        this.setupTheme();
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupThemeToggle();
        this.setupInteractions();
        this.setupAnimations();
        this.setupProgressTracking();

        setTimeout(() => {
            this.initializeDashboard();
        }, 100);

        window.techHub = this;
        console.log('✅ Tech Study Hub initialized successfully!');
    }

    async loadCourseData() {
        try {
            this.showLoading();
            const response = await fetch('coursedata.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.courseData = await response.json();
            console.log('✅ Course data loaded successfully');
        } catch (error) {
            console.error('❌ Error loading course data:', error);
            this.showNotification('Failed to load course data', 'error');
        } finally {
            this.hideLoading();
        }
    }

    getStoredTheme() {
        return localStorage.getItem('theme') || 
               (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    getStoredBookmarks() {
        try {
            return JSON.parse(localStorage.getItem('bookmarks') || '[]');
        } catch {
            return [];
        }
    }

    getStoredProgress() {
        try {
            return JSON.parse(localStorage.getItem('studyProgress') || '{}');
        } catch {
            return {};
        }
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
        this.updateThemeIcon();

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.theme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.theme);
                this.updateThemeIcon();
            }
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.theme = this.theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.theme);
                localStorage.setItem('theme', this.theme);
                this.updateThemeIcon();
                setTimeout(() => this.updateChartsForTheme(), 100);
                this.showNotification(`Switched to ${this.theme} mode`, 'info');
            });
        }
    }

    updateThemeIcon() {
        const icon = document.querySelector('.theme-icon');
        if (icon) {
            icon.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    updateChartsForTheme() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.update === 'function') {
                chart.update();
            }
        });
    }

    setupNavigation() {
        console.log('🔧 Setting up navigation system...');
        
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`Found ${navLinks.length} navigation links`);
        
        navLinks.forEach((link, index) => {
            const section = link.getAttribute('data-section');
            console.log(`Setting up nav link ${index + 1}: ${section}`);
            
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🎯 Navigation clicked: ${section}`);
                this.navigateToSection(section);
                
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });
        
        setTimeout(() => {
            this.navigateToSection('dashboard');
        }, 50);
    }

    navigateToSection(sectionId) {
        console.log(`🧭 Navigating to section: ${sectionId}`);
        
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`❌ Section not found: ${sectionId}`);
            return;
        }
        
        this.showLoading();
        
        const allSections = document.querySelectorAll('.content-section');
        allSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        setTimeout(() => {
            targetSection.style.display = 'block';
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            this.loadSectionContent(sectionId);
            setTimeout(() => {
                this.hideLoading();
            }, 500);
            console.log(`✅ Successfully navigated to: ${sectionId}`);
        }, 100);
    }

    setupMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (!mobileToggle || !sidebar) return;

        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            sidebar.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('open') &&
                !sidebar.contains(e.target) && 
                !mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.remove('open');
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            this.isLoading = true;
        }
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
            this.isLoading = false;
        }
    }

    loadSectionContent(sectionId) {
        console.log(`📄 Loading content for: ${sectionId}`);
        
        switch(sectionId) {
            case 'dashboard':
                setTimeout(() => this.initializeDashboard(), 200);
                break;
            case 'ai-ml':
                setTimeout(() => this.initializeAISection(), 200);
                break;
            case 'data-science':
                setTimeout(() => this.initializeDataScienceSection(), 200);
                break;
            case 'cybersecurity':
                setTimeout(() => this.initializeCyberSecuritySection(), 200);
                break;
            case 'quantum':
                setTimeout(() => this.initializeQuantumSection(), 200);
                break;
            case 'genai':
                setTimeout(() => this.initializeGenAISection(), 200);
                break;
            case 'web-development':
                setTimeout(() => this.initializeWebDevelopmentSection(), 200);
                break;
            case 'cloud-computing':
                setTimeout(() => this.initializeCloudComputingSection(), 200);
                break;
            case 'devops':
                setTimeout(() => this.initializeDevOpsSection(), 200);
                break;
            case 'blockchain':
                setTimeout(() => this.initializeBlockchainSection(), 200);
                break;
            case 'mobile-development':
                setTimeout(() => this.initializeMobileDevelopmentSection(), 200);
                break;
            case 'search':
                setTimeout(() => this.initializeSearchSection(), 200);
                break;
            default:
                console.warn(`Unknown section: ${sectionId}`);
        }
    }

    initializeDashboard() {
        console.log('📊 Initializing dashboard...');
        
        this.animateCounters();
        this.createCharts();
        this.animateProgressBars();
        this.displayBookmarks();
    }

    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        console.log(`Found ${counters.length} counters to animate`);
        
        counters.forEach((counter, index) => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    const displayValue = Math.min(Math.ceil(current), target);
                    
                    if (target >= 100) {
                        counter.textContent = `$${displayValue}B`;
                    } else {
                        counter.textContent = `${displayValue}%`;
                    }
                    
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target >= 100) {
                        counter.textContent = `$${target}B`;
                    } else {
                        counter.textContent = `${target}%`;
                    }
                    
                    counter.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        counter.style.transform = 'scale(1)';
                    }, 200);
                }
            };
            
            setTimeout(updateCounter, 100 * index);
        });
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            const progress = bar.getAttribute('data-progress') || 
                           parseInt(bar.style.width) || 0;
            
            setTimeout(() => {
                bar.style.width = `${progress}%`;
            }, 200 * index);
        });
    }

    createCharts() {
        console.log('📈 Creating charts...');
        
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        
        this.createMarketChart();
        this.createAdoptionChart();
    }

    createMarketChart() {
        const ctx = document.getElementById('marketChart');
        if (!ctx) return;

        this.charts.marketChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['AI Market', 'ML Market', 'Cybersecurity', 'Quantum Computing', 'GenAI', 'Web Dev', 'Cloud', 'DevOps', 'Blockchain', 'Mobile'],
                datasets: [
                    {
                        label: 'Current (2024)',
                        data: [391, 150, 200, 1.3, 50, 120, 180, 90, 70, 110],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'],
                        borderRadius: 8,
                        borderSkipped: false,
                    },
                    {
                        label: 'Projected (2030)',
                        data: [1800, 400, 377, 5.4, 110.8, 250, 350, 200, 150, 240],
                        backgroundColor: ['#1FB8CD80', '#FFC18580', '#B4413C80', '#ECEBD580', '#5D878F80', '#FF6B6B80', '#4ECDC480', '#45B7D180', '#96CEB480', '#FFEEAD80'],
                        borderRadius: 8,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { size: 12, weight: '500' }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: '#0066FF',
                        borderWidth: 1,
                        cornerRadius: 8,
                        displayColors: true
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: { 
                            font: { size: 11 },
                            callback: function(value) {
                                return '$' + value + 'B';
                            }
                        },
                        title: {
                            display: true,
                            text: 'Market Size ($ Billions)',
                            font: { size: 12, weight: '500' }
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutCubic'
                }
            }
        });
    }

    createAdoptionChart() {
        const ctx = document.getElementById('adoptionChart');
        if (!ctx) return;

        this.charts.adoptionChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America'],
                datasets: [{
                    data: [85, 72, 79, 62],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderWidth: 0,
                    hoverBorderWidth: 2,
                    hoverBorderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        cornerRadius: 8,
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                cutout: '60%',
                animation: {
                    duration: 1500,
                    easing: 'easeOutCubic'
                }
            }
        });
    }

    initializeAISection() {
        console.log('🤖 Initializing AI & ML section...');
        this.populateCourses('ai_machine_learning', 'aiCourses');
        this.setupFilters('aiCourses');
    }

    initializeDataScienceSection() {
        console.log('📈 Initializing Data Science section...');
        this.populateCourses('data_science', 'dataScienceCourses');
        this.setupFilters('dataScienceCourses');
    }

    initializeCyberSecuritySection() {
        console.log('🔒 Initializing Cybersecurity section...');
        this.populateCourses('cybersecurity', 'cybersecurityCourses');
        this.setupFilters('cybersecurityCourses');
    }

    initializeQuantumSection() {
        console.log('⚛️ Initializing Quantum section...');
        this.populateCourses('quantum_computing', 'quantumCourses');
        this.setupFilters('quantumCourses');
    }

    initializeGenAISection() {
        console.log('🧠 Initializing GenAI section...');
        this.populateCourses('generative_ai_llm', 'genaiCourses');
        this.setupFilters('genaiCourses');
    }

    initializeWebDevelopmentSection() {
        console.log('🌐 Initializing Web Development section...');
        this.populateCourses('web_development', 'webDevelopmentCourses');
        this.setupFilters('webDevelopmentCourses');
    }

    initializeCloudComputingSection() {
        console.log('☁️ Initializing Cloud Computing section...');
        this.populateCourses('cloud_computing', 'cloudComputingCourses');
        this.setupFilters('cloudComputingCourses');
    }

    initializeDevOpsSection() {
        console.log('⚙️ Initializing DevOps section...');
        this.populateCourses('devops', 'devopsCourses');
        this.setupFilters('devopsCourses');
    }

    initializeBlockchainSection() {
        console.log('🔗 Initializing Blockchain section...');
        this.populateCourses('blockchain', 'blockchainCourses');
        this.setupFilters('blockchainCourses');
    }

    initializeMobileDevelopmentSection() {
        console.log('📱 Initializing Mobile Development section...');
        this.populateCourses('mobile_development', 'mobileDevelopmentCourses');
        this.setupFilters('mobileDevelopmentCourses');
    }

    initializeSearchSection() {
        console.log('🔍 Initializing Search section...');
        this.setupSearchFunctionality();
    }

    populateCourses(dataKey, containerId) {
        const data = this.courseData[dataKey];
        if (!data) {
            console.warn(`No course data found for key: ${dataKey}`);
            return;
        }

        this.renderCourses(data.featured_courses, containerId);
        this.renderChannels(data.youtube_channels, `${containerId.replace('Courses', 'Channels')}`);
        this.renderResources(data.free_resources, `${containerId.replace('Courses', 'Resources')}`);
    }

    renderCourses(courses, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Course container not found: ${containerId}`);
            return;
        }

        const coursesHTML = courses.map(course => {
            const isFree = course.price === 'Free' || course.price.toLowerCase().includes('free');
            const priceClass = isFree ? 'free' : 'paid';
            const levelClass = course.level.toLowerCase().split(' ')[0];
            
            return `
                <div class="course-card" data-price="${isFree ? 'free' : 'paid'}" data-level="${levelClass}">
                    <div class="course-header">
                        <div class="course-platform">${course.platform}</div>
                        <h4 class="course-title">${course.name}</h4>
                        <div class="course-instructor">👨‍🏫 ${course.instructor}</div>
                        <div class="course-meta">
                            <div class="course-rating">
                                <span class="rating-stars">${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5 - Math.floor(course.rating))}</span>
                                <span class="rating-value">${course.rating}</span>
                            </div>
                            <div class="course-duration">⏱️ ${course.duration}</div>
                        </div>
                    </div>
                    <div class="course-body">
                        <p class="course-description">${course.description}</p>
                        <div class="course-level ${levelClass}">${course.level}</div>
                        <div class="course-footer">
                            <div class="course-price ${priceClass}">${course.price}</div>
                            <div class="course-actions">
                                <button class="btn btn-primary btn-sm" onclick="window.open('${course.url}', '_blank')">
                                    🚀 Visit Course
                                </button>
                                <button class="btn btn-secondary btn-sm bookmark-btn" 
                                        onclick="techHub.toggleCourseBookmark(${JSON.stringify(course).replace(/"/g, '&quot;')})">
                                    ⭐ Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = coursesHTML;
    }

    renderChannels(channels, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Channel container not found: ${containerId}`);
            return;
        }

        const channelsHTML = channels.map(channel => `
            <div class="channel-card">
                <div class="channel-icon">📺</div>
                <h4 class="channel-name">${channel.name}</h4>
                <p class="channel-description">${channel.description}</p>
                <a href="${channel.url}" target="_blank" class="channel-btn">
                    <span>▶️</span>
                    Subscribe & Watch
                </a>
            </div>
        `).join('');

        container.innerHTML = channelsHTML;
    }

    renderResources(resources, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Resource container not found: ${containerId}`);
            return;
        }

        const resourcesHTML = resources.map(resource => `
            <div class="resource-card">
                <h4 class="resource-name">${resource.name}</h4>
                <p class="resource-description">${resource.description}</p>
                <a href="${resource.url}" target="_blank" class="resource-btn">
                    🔗 Access Resource
                </a>
            </div>
        `).join('');

        container.innerHTML = resourcesHTML;
    }

    setupFilters(containerId) {
        const filterContainer = document.querySelector(`#${containerId.replace('Courses', '')} .filter-controls`);
        if (!filterContainer) {
            console.warn(`Filter container not found for: ${containerId}`);
            return;
        }

        const filterBtns = filterContainer.querySelectorAll('.filter-btn');
        console.log(`Found ${filterBtns.length} filter buttons for ${containerId}`);

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.applyCourseFilter(containerId, filter);
                this.currentFilter = filter;
            });
        });
    }

    applyCourseFilter(containerId, filter) {
        const courses = document.querySelectorAll(`#${containerId} .course-card`);
        console.log(`Applying filter '${filter}' to ${courses.length} courses in ${containerId}`);

        courses.forEach(course => {
            const coursePrice = course.getAttribute('data-price');
            let shouldShow = true;
            
            if (filter === 'free' && coursePrice !== 'free') {
                shouldShow = false;
            } else if (filter === 'paid' && coursePrice !== 'paid') {
                shouldShow = false;
            }
            
            course.style.display = shouldShow ? 'block' : 'none';
        });

        this.showNotification(`Showing ${filter === 'all' ? 'all' : filter} courses`, 'info');
    }

    toggleCourseBookmark(course) {
        const existingIndex = this.bookmarks.findIndex(b => b.name === course.name);
        
        if (existingIndex > -1) {
            this.bookmarks.splice(existingIndex, 1);
            this.showNotification('Course removed from bookmarks', 'info');
        } else {
            this.bookmarks.push({
                ...course,
                id: Date.now(),
                dateAdded: new Date().toISOString()
            });
            this.showNotification('Course bookmarked!', 'success');
        }

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        this.displayBookmarks();
    }

    removeBookmark(courseName) {
        this.bookmarks = this.bookmarks.filter(b => b.name !== courseName);
        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        this.displayBookmarks();
        this.showNotification('Bookmark removed', 'info');
    }

    displayBookmarks() {
        const bookmarksLists = document.querySelectorAll('.bookmarks-container');
        if (!bookmarksLists) return;
        
        bookmarksLists.forEach(bookmarksList => {
            if (this.bookmarks.length === 0) {
                bookmarksList.innerHTML = `
                    <div class="empty-bookmarks">
                        <div class="empty-icon">📖</div>
                        <p>No courses bookmarked yet</p>
                        <p>Bookmark courses to save them for later</p>
                    </div>
                `;
                return;
            }

            const bookmarksHTML = this.bookmarks.map(bookmark => {
                const typeIcon = {
                    course: '🎓',
                    youtube: '📺',
                    resource: '🔗'
                }[bookmark.type] || '🎓';

                return `
                    <div class="bookmark-item">
                        <div class="bookmark-content">
                            <div class="bookmark-header">
                                <span class="bookmark-icon">${typeIcon}</span>
                                <h4 class="bookmark-title">${bookmark.name}</h4>
                            </div>
                            <div class="bookmark-meta">
                                ${bookmark.platform ? `<span class="bookmark-platform">📁 ${bookmark.platform}</span>` : ''}
                                ${bookmark.price ? `<span class="bookmark-price">${bookmark.price}</span>` : ''}
                            </div>
                        </div>
                        <div class="bookmark-actions">
                            <button class="btn btn-primary btn-sm" onclick="window.open('${bookmark.url}', '_blank')">
                                🚀 Visit
                            </button>
                            <button class="bookmark-remove" onclick="techHub.removeBookmark('${bookmark.name}')" title="Remove bookmark">×</button>
                        </div>
                    </div>
                `;
            }).join('');

            bookmarksList.innerHTML = bookmarksHTML;
        });
        this.addBookmarkCSS();
    }

    addBookmarkCSS() {
        if (document.getElementById('bookmark-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'bookmark-styles';
        style.textContent = `
            .bookmark-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: var(--space-4);
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-base);
                transition: all var(--transition-fast);
                gap: var(--space-4);
                margin-bottom: var(--space-3);
                border-left: 4px solid var(--electric-blue);
            }
            .bookmark-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .bookmark-content {
                flex: 1;
            }
            .bookmark-header {
                display: flex;
                align-items: center;
                gap: var(--space-2);
                margin-bottom: var(--space-2);
            }
            .bookmark-icon {
                font-size: 1.2rem;
            }
            .bookmark-title {
                font-size: 1rem;
                font-weight: var(--font-weight-medium);
                color: var(--text-primary);
                margin: 0;
            }
            .bookmark-meta {
                display: flex;
                gap: var(--space-3);
                align-items: center;
            }
            .bookmark-platform, .bookmark-price {
                color: var(--text-secondary);
                font-size: 0.875rem;
            }
            .bookmark-actions {
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }
            .bookmark-remove {
                background: none;
                border: none;
                color: var(--text-light);
                cursor: pointer;
                padding: var(--space-2);
                font-size: 1.2rem;
                border-radius: var(--radius-sm);
                transition: all var(--transition-fast);
            }
            .bookmark-remove:hover {
                background: rgba(236, 72, 153, 0.1);
                color: var(--hot-pink);
            }
            .search-result-item {
                background: var(--bg-primary);
                border-radius: var(--radius-md);
                padding: var(--space-5);
                box-shadow: var(--shadow-base);
                transition: all var(--transition-fast);
                margin-bottom: var(--space-4);
                border-left: 4px solid var(--electric-blue);
            }
            .search-result-item:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .result-header {
                display: flex;
                align-items: flex-start;
                gap: var(--space-3);
                margin-bottom: var(--space-3);
            }
            .result-icon {
                font-size: 1.5rem;
                margin-top: var(--space-1);
            }
            .result-content {
                flex: 1;
            }
            .result-title {
                font-size: 1.125rem;
                font-weight: var(--font-weight-semibold);
                color: var(--electric-blue);
                margin: 0 0 var(--space-2) 0;
            }
            .result-meta {
                display: flex;
                gap: var(--space-3);
                margin-bottom: var(--space-2);
            }
            .result-type, .result-section, .result-platform {
                font-size: 0.875rem;
                color: var(--text-secondary);
                background: var(--bg-secondary);
                padding: var(--space-1) var(--space-2);
                border-radius: var(--radius-sm);
            }
            .result-description {
                font-size: 0.875rem;
                color: var(--text-primary);
                margin-bottom: var(--space-3);
            }
            .result-price {
                font-size: 0.875rem;
                color: var(--text-secondary);
                margin-bottom: var(--space-2);
            }
            .result-actions {
                display: flex;
                gap: var(--space-2);
            }
            .result-rating {
                display: flex;
                align-items: center;
                gap: var(--space-1);
            }
            .rating-stars {
                color: var(--electric-blue);
            }
            .rating-value {
                font-size: 0.875rem;
                color: var(--text-secondary);
            }
        `;
        document.head.appendChild(style);
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const filterChips = document.querySelectorAll('.filter-chip');
        const suggestionTags = document.querySelectorAll('.suggestion-tag');

        if (!searchInput || !searchBtn) return;

        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                console.log(`🔍 Searching for: ${query}`);
                this.performSearch(query);
            } else {
                this.showNotification('Please enter a search term', 'info');
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        filterChips.forEach(chip => {
            chip.addEventListener('click', () => {
                filterChips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                
                const filter = chip.getAttribute('data-filter');
                this.filterSearchResults(filter);
            });
        });

        suggestionTags.forEach(tag => {
            tag.addEventListener('click', () => {
                searchInput.value = tag.textContent;
                this.performSearch(tag.textContent);
            });
        });

        this.displayBookmarks();
    }

    performSearch(query) {
        console.log(`🔍 Performing search: ${query}`);
        
        const searchResults = document.getElementById('searchResults');
        const resultsList = document.getElementById('resultsList');
        const resultsCount = document.getElementById('resultsCount');

        if (!searchResults || !resultsList) return;

        resultsList.innerHTML = `
            <div class="search-loading">
                <div class="spinner"></div>
                <p>Searching for "${query}"...</p>
            </div>
        `;
        searchResults.classList.remove('hidden');

        setTimeout(() => {
            this.searchResults = this.searchAllCourses(query);
            this.displaySearchResults(this.searchResults);
            
            if (resultsCount) {
                resultsCount.textContent = `${this.searchResults.length} results`;
            }
        }, 1500);
    }

    searchAllCourses(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        Object.keys(this.courseData).forEach(key => {
            const section = this.courseData[key];
            
            section.featured_courses.forEach(course => {
                if (course.name.toLowerCase().includes(queryLower) ||
                    course.description.toLowerCase().includes(queryLower) ||
                    course.instructor.toLowerCase().includes(queryLower)) {
                    results.push({
                        ...course,
                        type: 'course',
                        section: section.title,
                        relevance: this.calculateRelevance(course, queryLower)
                    });
                }
            });

            section.youtube_channels.forEach(channel => {
                if (channel.name.toLowerCase().includes(queryLower) ||
                    channel.description.toLowerCase().includes(queryLower)) {
                    results.push({
                        ...channel,
                        type: 'youtube',
                        section: section.title,
                        relevance: this.calculateRelevance(channel, queryLower)
                    });
                }
            });

            section.free_resources.forEach(resource => {
                if (resource.name.toLowerCase().includes(queryLower) ||
                    resource.description.toLowerCase().includes(queryLower)) {
                    results.push({
                        ...resource,
                        type: 'resource',
                        section: section.title,
                        relevance: this.calculateRelevance(resource, queryLower)
                    });
                }
            });
        });

        return results.sort((a, b) => b.relevance - a.relevance);
    }

    calculateRelevance(item, query) {
        let score = 0;
        const title = (item.name || '').toLowerCase();
        const description = (item.description || '').toLowerCase();

        if (title.includes(query)) score += 10;
        if (description.includes(query)) score += 5;
        if (title === query) score += 20;

        return score;
    }

    displaySearchResults(results) {
        const resultsList = document.getElementById('resultsList');
        if (!resultsList) return;
        
        if (results.length === 0) {
            resultsList.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>Try different search terms or browse our featured courses</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(result => {
            const typeIcon = {
                course: '🎓',
                youtube: '📺',
                resource: '🔗'
            }[result.type] || '📄';

            const ratingHTML = result.rating ? 
                `<div class="result-rating">
                    <span class="rating-stars">${'★'.repeat(Math.floor(result.rating))}${'☆'.repeat(5 - Math.floor(result.rating))}</span>
                    <span class="rating-value">${result.rating}</span>
                </div>` : '';

            return `
                <div class="search-result-item" data-result-id="${result.name}">
                    <div class="result-header">
                        <div class="result-icon">${typeIcon}</div>
                        <div class="result-content">
                            <h4 class="result-title">${result.name}</h4>
                            <div class="result-meta">
                                <span class="result-type">${result.type}</span>
                                <span class="result-section">${result.section}</span>
                                ${result.platform ? `<span class="result-platform">${result.platform}</span>` : ''}
                            </div>
                            ${ratingHTML}
                        </div>
                    </div>
                    <p class="result-description">${result.description}</p>
                    ${result.price ? `<div class="result-price">${result.price}</div>` : ''}
                    <div class="result-actions">
                        <button class="btn btn-primary btn-sm" onclick="window.open('${result.url}', '_blank')">
                            🚀 Visit ${result.type === 'course' ? 'Course' : result.type === 'youtube' ? 'Channel' : 'Resource'}
                        </button>
                        <button class="btn btn-secondary btn-sm bookmark-btn" 
                                onclick="techHub.toggleCourseBookmark(${JSON.stringify(result).replace(/"/g, '&quot;')})">
                            ⭐ Save
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        resultsList.innerHTML = resultsHTML;
    }

    filterSearchResults(filter) {
        if (!this.searchResults.length) return;

        let filteredResults = this.searchResults;
        if (filter !== 'all') {
            if (filter === 'courses') {
                filteredResults = this.searchResults.filter(result => result.type === 'course');
            } else if (filter === 'youtube') {
                filteredResults = this.searchResults.filter(result => result.type === 'youtube');
            } else if (filter === 'free') {
                filteredResults = this.searchResults.filter(result => 
                    !result.price || result.price === 'Free' || result.price.toLowerCase().includes('free'));
            } else if (filter === 'paid') {
                filteredResults = this.searchResults.filter(result => 
                    result.price && result.price !== 'Free' && !result.price.toLowerCase().includes('free'));
            }
        }

        this.displaySearchResults(filteredResults);
        
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = `${filteredResults.length} results`;
        }
    }

    setupProgressTracking() {
        const progressInputs = document.querySelectorAll('.progress-input');
        
        progressInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                const courseId = e.target.getAttribute('data-course-id');
                const progress = parseInt(e.target.value);
                
                this.studyProgress[courseId] = progress;
                localStorage.setItem('studyProgress', JSON.stringify(this.studyProgress));
                
                this.updateProgressDisplay(courseId, progress);
                this.showNotification('Progress updated!', 'success');
            });
        });
    }

    updateProgressDisplay(courseId, progress) {
        const progressBar = document.querySelector(`.progress-fill[data-course-id="${courseId}"]`);
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    }

    setupInteractions() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.showTooltip(element);
            });
            element.addEventListener('mouseleave', () => {
                this.hideTooltip(element);
            });
        });

        const cards = document.querySelectorAll('.course-card, .channel-card, .resource-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = 'var(--shadow-lg)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'var(--shadow-base)';
            });
        });
    }

    showTooltip(element) {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = tooltipText;
        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.left = `${rect.left + window.scrollX + rect.width / 2}px`;
        tooltip.style.top = `${rect.top + window.scrollY - 40}px`;
        tooltip.style.transform = 'translateX(-50%)';
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        document.querySelectorAll('.content-section').forEach(section => {
            observer.observe(section);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TechStudyHub();
});