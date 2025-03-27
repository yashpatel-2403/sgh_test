
/**
 * Main JavaScript for PM Poshan Portal
 * Common utilities and functions used across multiple pages
 */

// Set the current date for date inputs
document.addEventListener('DOMContentLoaded', function() {
  // Set the current date for date inputs if they exist
  const dateInputs = {
    'submission-date': null,
    'expense-date': null,
    'grant-date': null,
    'start-date': null,
    'end-date': null
  };
  
  const today = new Date().toISOString().split('T')[0];
  
  // Set date values
  Object.keys(dateInputs).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = today;
    }
  });
  
  // Set end date for reports to next month
  const endDate = document.getElementById('end-date');
  if (endDate) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    endDate.value = nextMonth.toISOString().split('T')[0];
  }

  // Update copyright year
  const currentYearElement = document.getElementById('current-year');
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // Check auth on page load except for login and home pages
  checkAuth();
  
  // Add event listeners for common elements
  setupCommonEventListeners();
});

/**
 * Authentication check
 * Redirects to login if not authenticated
 */
function checkAuth() {
  const publicPages = ['login.html', 'index.html', ''];
  const currentPage = window.location.pathname.split('/').pop();
  
  // Skip auth check for public pages
  if (publicPages.includes(currentPage)) {
    return;
  }
  
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const userRole = sessionStorage.getItem('userRole');
  
  if (!isLoggedIn) {
    window.location.href = 'login.html';
    return;
  }
  
  // Redirect if trying to access wrong dashboard
  const adminPages = ['admin-dashboard.html', 'bill-approval.html', 'grant-allocation.html', 
                      'report-generation.html', 'organization-management.html'];
  
  const userPages = ['user-dashboard.html', 'bill-submission.html', 'expense-entry.html'];
  
  const isAdminPage = adminPages.includes(currentPage);
  const isUserPage = userPages.includes(currentPage);
  
  if (userRole === 'admin' && isUserPage) {
    window.location.href = 'admin-dashboard.html';
  } else if (userRole === 'user' && isAdminPage) {
    window.location.href = 'user-dashboard.html';
  }
}

/**
 * Set up event listeners for common elements
 */
function setupCommonEventListeners() {
  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    setupLoginForm();
  }
  
  // Navigation active state
  const navLinks = document.querySelectorAll('a[data-page]');
  highlightActiveNavLink(navLinks);
  
  // Logout Buttons
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  
  // Bill Form
  const billForm = document.getElementById('bill-form');
  if (billForm) {
    setupBillForm();
  }
  
  // Expense Form
  const expenseForm = document.getElementById('expense-form');
  if (expenseForm) {
    setupExpenseForm();
  }
  
  // Grant Form
  const grantForm = document.getElementById('grant-form');
  if (grantForm) {
    setupGrantForm();
  }
  
  // Report Form
  const reportForm = document.getElementById('report-form');
  if (reportForm) {
    setupReportForm();
  }
  
  // Organization Form
  const organizationForm = document.getElementById('organization-form');
  if (organizationForm) {
    setupOrganizationForm();
  }
  
  // Close notification button
  const notificationClose = document.getElementById('notification-close');
  if (notificationClose) {
    notificationClose.addEventListener('click', function() {
      document.getElementById('toast-container').classList.add('hidden');
    });
  }
  
  // Bill approval/rejection buttons
  setupBillActionButtons();
}

/**
 * Generate navigation based on user role
 */
function generateNavigation(userRole, currentPage) {
  const dynamicNav = document.getElementById('dynamic-nav');
  if (!dynamicNav) return;
  
  let navHTML = '<ul>';
  
  if (userRole === 'admin') {
    navHTML += `
      <li><a href="admin-dashboard.html" ${currentPage === 'admin-dashboard' ? 'class="active"' : ''} data-page="admin-dashboard">Dashboard</a></li>
      <li><a href="bill-approval.html" ${currentPage === 'bill-approval' ? 'class="active"' : ''} data-page="bill-approval">Approve Bills</a></li>
      <li><a href="grant-allocation.html" ${currentPage === 'grant-allocation' ? 'class="active"' : ''} data-page="grant-allocation">Allocate Grants</a></li>
      <li><a href="report-generation.html" ${currentPage === 'report-generation' ? 'class="active"' : ''} data-page="report-generation">Generate Reports</a></li>
      <li><a href="organization-management.html" ${currentPage === 'organization-management' ? 'class="active"' : ''} data-page="organization-management">Manage Organizations</a></li>
      <li><a href="notifications.html" ${currentPage === 'notifications' ? 'class="active"' : ''} data-page="notifications">Notifications</a></li>
    `;
  } else {
    navHTML += `
      <li><a href="user-dashboard.html" ${currentPage === 'user-dashboard' ? 'class="active"' : ''} data-page="user-dashboard">Dashboard</a></li>
      <li><a href="bill-submission.html" ${currentPage === 'bill-submission' ? 'class="active"' : ''} data-page="bill-submission">Submit Bills</a></li>
      <li><a href="expense-entry.html" ${currentPage === 'expense-entry' ? 'class="active"' : ''} data-page="expense-entry">Enter Expenses</a></li>
      <li><a href="notifications.html" ${currentPage === 'notifications' ? 'class="active"' : ''} data-page="notifications">Notifications</a></li>
    `;
  }
  
  navHTML += '</ul>';
  dynamicNav.innerHTML = navHTML;
}

/**
 * Highlight the active navigation link
 */
function highlightActiveNavLink(navLinks) {
  if (!navLinks.length) return;
  
  const currentPage = window.location.pathname.split('/').pop();
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Handle logout functionality
 */
function handleLogout() {
  api.logout()
    .then(() => {
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userRole');
      window.location.href = 'login.html';
    })
    .catch(error => {
      console.error('Logout error:', error);
      // Force logout anyway
      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('userRole');
      window.location.href = 'login.html';
    });
}

/**
 * Set up login form
 */
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    
    api.login({ username, password, role })
      .then(response => {
        if (response.success) {
          // Store user info in sessionStorage
          sessionStorage.setItem('isLoggedIn', 'true');
          sessionStorage.setItem('userRole', response.user.role);
          
          // Redirect to appropriate dashboard
          window.location.href = response.user.role === 'admin' ? 
            'admin-dashboard.html' : 'user-dashboard.html';
        } else {
          loginError.textContent = response.message;
        }
      })
      .catch(error => {
        console.error('Login error:', error);
        loginError.textContent = 'An error occurred. Please try again.';
      });
  });
}

/**
 * Set up bill submission form
 */
function setupBillForm() {
  const billForm = document.getElementById('bill-form');
  const billCancel = document.getElementById('bill-cancel');
  const billDocument = document.getElementById('bill-document');
  const fileName = document.getElementById('file-name');
  
  // Handle file selection display
  if (billDocument) {
    billDocument.addEventListener('change', function() {
      if (this.files && this.files.length > 0) {
        fileName.textContent = this.files[0].name;
        fileName.classList.remove('hidden');
      } else {
        fileName.classList.add('hidden');
      }
    });
  }
  
  // Handle form submission
  billForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const amount = document.getElementById('bill-amount').value;
    const description = document.getElementById('bill-description').value;
    const date = document.getElementById('submission-date').value;
    
    if (!amount || !description) {
      showNotification('Please fill in all required fields.');
      return;
    }
    
    // Prepare form data for API
    const billData = {
      organizationName: 'ABC Organization', // In a real app, get from user profile
      amount: parseFloat(amount),
      description: description,
      date: date
    };
    
    // Submit bill through API
    api.submitBill(billData)
      .then(response => {
        if (response.success) {
          showNotification('Bill submitted successfully.');
          
          // Reset form
          billForm.reset();
          if (fileName) {
            fileName.classList.add('hidden');
          }
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 2000);
        } else {
          showNotification('Failed to submit bill. Please try again.');
        }
      })
      .catch(error => {
        console.error('Bill submission error:', error);
        showNotification('An error occurred. Please try again.');
      });
  });
  
  // Handle cancel button
  if (billCancel) {
    billCancel.addEventListener('click', function() {
      window.location.href = 'user-dashboard.html';
    });
  }
}

/**
 * Set up expense entry form
 */
function setupExpenseForm() {
  const expenseForm = document.getElementById('expense-form');
  const expenseCancel = document.getElementById('expense-cancel');
  
  expenseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const category = document.getElementById('expense-category').value;
    const amount = document.getElementById('expense-amount').value;
    const date = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description')?.value || '';
    
    if (!category || !amount || !date) {
      showNotification('Please fill in all required fields.');
      return;
    }
    
    // Prepare form data for API
    const expenseData = {
      organizationName: 'ABC Organization', // In a real app, get from user profile
      category: category,
      amount: parseFloat(amount),
      date: date,
      description: description
    };
    
    // Submit expense through API
    api.addExpense(expenseData)
      .then(response => {
        if (response.success) {
          showNotification('Expense recorded successfully.');
          
          // Reset form
          expenseForm.reset();
          const expenseDate = document.getElementById('expense-date');
          if (expenseDate) {
            expenseDate.value = new Date().toISOString().split('T')[0];
          }
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = 'user-dashboard.html';
          }, 2000);
        } else {
          showNotification('Failed to record expense. Please try again.');
        }
      })
      .catch(error => {
        console.error('Expense submission error:', error);
        showNotification('An error occurred. Please try again.');
      });
  });
  
  // Handle cancel button
  if (expenseCancel) {
    expenseCancel.addEventListener('click', function() {
      window.location.href = 'user-dashboard.html';
    });
  }
}

/**
 * Set up grant allocation form
 */
function setupGrantForm() {
  const grantForm = document.getElementById('grant-form');
  const grantReset = document.getElementById('grant-reset');
  
  // Load organizations for dropdown
  const organizationSelect = document.getElementById('organization-select');
  if (organizationSelect) {
    api.getOrganizations()
      .then(organizations => {
        organizationSelect.innerHTML = '<option value="">Select Organization</option>';
        organizations.forEach(org => {
          organizationSelect.innerHTML += `<option value="${org.id}">${org.name} (Budget: ₹${org.budget.toLocaleString()})</option>`;
        });
      })
      .catch(error => {
        console.error('Error loading organizations:', error);
      });
  }
  
  // Handle form submission
  if (grantForm) {
    grantForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const organizationId = document.getElementById('organization-select').value;
      const amount = document.getElementById('grant-amount').value;
      const date = document.getElementById('grant-date').value;
      
      if (!organizationId || !amount || !date) {
        showNotification('Please fill in all required fields.');
        return;
      }
      
      // Get organization name for the record
      const organizationSelect = document.getElementById('organization-select');
      const selectedOption = organizationSelect.options[organizationSelect.selectedIndex];
      const organizationName = selectedOption.text.split(' (')[0];
      
      // Prepare form data for API
      const grantData = {
        organizationId: organizationId,
        organizationName: organizationName,
        amount: parseFloat(amount),
        date: date
      };
      
      // Submit grant through API
      api.allocateGrant(grantData)
        .then(response => {
          if (response.success) {
            showNotification('Grant allocated successfully.');
            
            // Reset form
            grantForm.reset();
            const grantDate = document.getElementById('grant-date');
            if (grantDate) {
              grantDate.value = new Date().toISOString().split('T')[0];
            }
            
            // Refresh page to show updated table
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            showNotification('Failed to allocate grant. Please try again.');
          }
        })
        .catch(error => {
          console.error('Grant allocation error:', error);
          showNotification('An error occurred. Please try again.');
        });
    });
  }
  
  // Handle reset button
  if (grantReset) {
    grantReset.addEventListener('click', function() {
      grantForm.reset();
      const grantDate = document.getElementById('grant-date');
      if (grantDate) {
        grantDate.value = new Date().toISOString().split('T')[0];
      }
    });
  }
}

/**
 * Set up report generation form
 */
function setupReportForm() {
  const reportForm = document.getElementById('report-form');
  
  reportForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const reportType = document.getElementById('report-type').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    
    // Prepare report parameters
    const reportParams = {
      type: reportType,
      startDate: startDate,
      endDate: endDate
    };
    
    // Generate report through API
    api.generateReport(reportParams)
      .then(response => {
        if (response.success) {
          showNotification('Report generated successfully. Downloading...');
          
          // Reset form after a delay
          setTimeout(() => {
            reportForm.reset();
            
            // Reset dates
            const startDateInput = document.getElementById('start-date');
            const endDateInput = document.getElementById('end-date');
            
            if (startDateInput) {
              startDateInput.value = new Date().toISOString().split('T')[0];
            }
            
            if (endDateInput) {
              const nextMonth = new Date();
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              endDateInput.value = nextMonth.toISOString().split('T')[0];
            }
          }, 2000);
        } else {
          showNotification('Failed to generate report. Please try again.');
        }
      })
      .catch(error => {
        console.error('Report generation error:', error);
        showNotification('An error occurred. Please try again.');
      });
  });
}

/**
 * Set up organization management form
 */
function setupOrganizationForm() {
  const organizationForm = document.getElementById('organization-form');
  
  organizationForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('organization-name').value;
    const budget = document.getElementById('organization-budget').value;
    
    if (!name || !budget) {
      showNotification('Please fill in all required fields.');
      return;
    }
    
    // Prepare organization data
    const orgData = {
      name: name,
      budget: parseFloat(budget)
    };
    
    // Add organization through API
    api.addOrganization(orgData)
      .then(response => {
        if (response.success) {
          showNotification('Organization added successfully.');
          
          // Reset form
          organizationForm.reset();
          
          // Refresh page to show updated table
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          showNotification('Failed to add organization. Please try again.');
        }
      })
      .catch(error => {
        console.error('Organization addition error:', error);
        showNotification('An error occurred. Please try again.');
      });
  });
}

/**
 * Set up bill approval/rejection buttons
 */
function setupBillActionButtons() {
  const approveButtons = document.querySelectorAll('.btn-primary');
  const rejectButtons = document.querySelectorAll('.btn-secondary');
  
  // Handle bill approval
  approveButtons.forEach(button => {
    if (button.textContent === 'Approve') {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        const billId = parseInt(row.getAttribute('data-id') || row.id.split('-')[1]);
        
        api.approveBill(billId)
          .then(() => {
            showNotification('Bill approved successfully.');
            
            // Visual feedback
            row.style.backgroundColor = '#f0fff4';
            setTimeout(() => {
              row.remove();
            }, 1000);
          })
          .catch(error => {
            console.error('Bill approval error:', error);
            showNotification('Failed to approve bill. Please try again.');
          });
      });
    }
  });
  
  // Handle bill rejection
  rejectButtons.forEach(button => {
    if (button.textContent === 'Reject') {
      button.addEventListener('click', function() {
        const row = this.closest('tr');
        const billId = parseInt(row.getAttribute('data-id') || row.id.split('-')[1]);
        
        api.rejectBill(billId)
          .then(() => {
            showNotification('Bill rejected.');
            
            // Visual feedback
            row.style.backgroundColor = '#fff5f5';
            setTimeout(() => {
              row.remove();
            }, 1000);
          })
          .catch(error => {
            console.error('Bill rejection error:', error);
            showNotification('Failed to reject bill. Please try again.');
          });
      });
    }
  });
}

/**
 * Show notification toast
 */
function showNotification(message) {
  const toastContainer = document.getElementById('toast-container');
  const notificationMessage = document.getElementById('notification-message');
  
  if (toastContainer && notificationMessage) {
    notificationMessage.textContent = message;
    toastContainer.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      toastContainer.classList.add('hidden');
    }, 5000);
  }
}
