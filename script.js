
  const jobsKey = 'jobs';
  const userKey = 'loggedInUser';
  let editingIndex = null;

  function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem(userKey, JSON.stringify({role: 'admin'}));
      showMain();
    } else if (username === 'user' && password === 'user123') {
      localStorage.setItem(userKey, JSON.stringify({role: 'user'}));
      showMain();
    } else {
      alert('Invalid credentials');
    }
  }

  function showMain() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('mainContainer').style.display = 'flex';

    const user = JSON.parse(localStorage.getItem(userKey));
    if (user.role === 'admin') {
      document.getElementById('addJobBtn').style.display = 'inline-block';
    }
    document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem(userKey));

  // Add sample jobs if none exist
  if (!localStorage.getItem(jobsKey)) {
    const sampleJobs = [
      { title: "Frontend Developer", company: "Techify", desc: "Build responsive user interfaces using React." },
      { title: "Graphic Designer", company: "PixelWorks", desc: "Create modern, eye-catching brand visuals." },
      { title: "Data Analyst", company: "Insight Analytics", desc: "Analyze and visualize company data for insights." },
      { title: "Marketing Specialist", company: "AdVibe Media", desc: "Plan digital campaigns to boost brand growth." }
    ];
    localStorage.setItem(jobsKey, JSON.stringify(sampleJobs));
  }

  if (user) showJobBoard();
});
    displayJobs();
  }

  function logout() {
    localStorage.removeItem(userKey);
    document.getElementById('mainContainer').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'block';
  }

  function openAddJobModal(editIndex = null) {
    editingIndex = editIndex;
    const modal = document.getElementById('addJobModal');
    const modalTitle = document.getElementById('modalTitle');

    if (editIndex !== null) {
      const jobs = JSON.parse(localStorage.getItem(jobsKey)) || [];
      const job = jobs[editIndex];
      document.getElementById('jobTitle').value = job.title;
      document.getElementById('jobCompany').value = job.company;
      document.getElementById('jobDesc').value = job.desc;
      modalTitle.textContent = 'Edit Job';
    } else {
      document.getElementById('jobTitle').value = '';
      document.getElementById('jobCompany').value = '';
      document.getElementById('jobDesc').value = '';
      modalTitle.textContent = 'Add Job';
    }

    modal.style.display = 'flex';
  }

  function closeAddJobModal() {
    document.getElementById('addJobModal').style.display = 'none';
  }

  function saveJob() {
    const title = document.getElementById('jobTitle').value;
    const company = document.getElementById('jobCompany').value;
    const desc = document.getElementById('jobDesc').value;

    if (!title || !company || !desc) return alert('Please fill all fields');

    let jobs = JSON.parse(localStorage.getItem(jobsKey)) || [];

    if (editingIndex !== null) {
      jobs[editingIndex] = {title, company, desc, date: new Date().toISOString()};
      editingIndex = null;
    } else {
      jobs.push({title, company, desc, date: new Date().toISOString()});
    }

    localStorage.setItem(jobsKey, JSON.stringify(jobs));
    closeAddJobModal();
    displayJobs();
  }

  function displayJobs() {
    const jobList = document.getElementById('jobList');
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('dateFilter').value;
    const user = JSON.parse(localStorage.getItem(userKey));
    const jobs = JSON.parse(localStorage.getItem(jobsKey)) || [];

    const filteredJobs = jobs.filter(job => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchInput) ||
        job.company.toLowerCase().includes(searchInput);
      const matchesDate = !dateFilter || new Date(job.date) >= new Date(dateFilter);
      return matchesSearch && matchesDate;
    });

    jobList.innerHTML = filteredJobs.length
      ? ''
      : '<p>No jobs found.</p>';

    filteredJobs.forEach((job, index) => {
      const card = document.createElement('div');
      card.className = 'job-card';
      card.innerHTML = `
        <h3>${job.title}</h3>
        <p><strong>${job.company}</strong></p>
        <p><small>${new Date(job.date).toLocaleDateString()}</small></p>
        <button onclick="viewJobDetails(${index})">View Details</button>
        ${user.role === 'admin' ? `
          <button onclick="openAddJobModal(${index})">Edit</button>
          <button class="delete" onclick="deleteJob(${index})">Delete</button>
        ` : ''}
      `;
      jobList.appendChild(card);
    });
  }

  function deleteJob(index) {
    if (!confirm('Are you sure you want to delete this job?')) return;
    let jobs = JSON.parse(localStorage.getItem(jobsKey)) || [];
    jobs.splice(index, 1);
    localStorage.setItem(jobsKey, JSON.stringify(jobs));
    displayJobs();
  }

  function viewJobDetails(index) {
    const jobs = JSON.parse(localStorage.getItem(jobsKey)) || [];
    const job = jobs[index];
    const panel = document.getElementById('detailsPanel');

    document.getElementById('detailsTitle').innerText = job.title;
    document.getElementById('detailsCompany').innerText = job.company;
    document.getElementById('detailsDesc').innerText = job.desc;

    panel.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem(userKey));
    if (user) showMain();
  });

