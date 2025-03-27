
/**
 * API Module for PM Poshan Portal
 * This module simulates API calls that would be made to a Django backend.
 * Replace these with actual fetch calls to Django API endpoints when integrating.
 */

const api = (function() {
  // Mock data - this would come from Django in production
  const mockData = {
    users: [
      { username: 'admin', password: 'admin123', role: 'admin' },
      { username: 'user', password: 'user123', role: 'user' }
    ],
    
    notifications: [
      { id: 1, date: '2023-06-25', message: 'Your bill #BILL-001 has been approved.', type: 'Bill', status: 'Unread' },
      { id: 2, date: '2023-06-23', message: 'A new grant of ₹150,000 has been allocated to your organization.', type: 'Grant', status: 'Unread' },
      { id: 3, date: '2023-06-20', message: 'Your bill #BILL-002 requires additional documentation.', type: 'Bill', status: 'Read' },
      { id: 4, date: '2023-06-15', message: 'System maintenance scheduled for June 30, 2023.', type: 'System', status: 'Read' }
    ],
    
    bills: [
      { id: 1, organizationName: 'ABC Organization', amount: 45000, description: 'Food supplies', date: '2023-06-10', status: 'approved' },
      { id: 2, organizationName: 'ABC Organization', amount: 80000, description: 'Staff salary', date: '2023-06-15', status: 'pending' },
      { id: 3, organizationName: 'ABC Organization', amount: 25000, description: 'Kitchen equipment', date: '2023-06-18', status: 'pending' },
      { id: 4, organizationName: 'ABC Organization', amount: 12000, description: 'Transport charges', date: '2023-06-20', status: 'approved' },
      { id: 5, organizationName: 'ABC Organization', amount: 8000, description: 'Maintenance', date: '2023-06-22', status: 'rejected' }
    ],
    
    organizations: [
      { id: 'org-1', name: 'ABC Organization', budget: 500000, allocated: 250000 },
      { id: 'org-2', name: 'XYZ Foundation', budget: 400000, allocated: 180000 },
      { id: 'org-3', name: 'PQR Trust', budget: 300000, allocated: 150000 },
      { id: 'org-4', name: 'DEF Association', budget: 450000, allocated: 0 },
      { id: 'org-5', name: 'GHI Society', budget: 350000, allocated: 200000 }
    ],
    
    grants: [
      { id: 'alloc-1', organizationId: 'org-1', organizationName: 'ABC Organization', amount: 250000, date: '2023-06-01', status: 'completed' },
      { id: 'alloc-2', organizationId: 'org-2', organizationName: 'XYZ Foundation', amount: 180000, date: '2023-06-10', status: 'completed' },
      { id: 'alloc-3', organizationId: 'org-3', organizationName: 'PQR Trust', amount: 150000, date: '2023-06-15', status: 'completed' },
      { id: 'alloc-4', organizationId: 'org-5', organizationName: 'GHI Society', amount: 200000, date: '2023-06-20', status: 'completed' }
    ],
    
    expenses: [
      { id: 1, organizationName: 'ABC Organization', category: 'food', amount: 15000, date: '2023-06-05', description: 'Weekly food supplies' },
      { id: 2, organizationName: 'ABC Organization', category: 'transport', amount: 5000, date: '2023-06-10', description: 'Transport for staff' },
      { id: 3, organizationName: 'ABC Organization', category: 'utilities', amount: 8000, date: '2023-06-15', description: 'Electricity bills' }
    ]
  };
  
  // Helper to simulate API latency
  function simulateDelay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Authentication methods
   */
  function login(credentials) {
    return simulateDelay(500).then(() => {
      const user = mockData.users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password && 
        u.role === credentials.role
      );
      
      if (user) {
        return { 
          success: true, 
          user: { username: user.username, role: user.role } 
        };
      } else {
        return { 
          success: false, 
          message: 'Invalid credentials. Please try again.' 
        };
      }
    });
  }
  
  function logout() {
    return simulateDelay(200).then(() => ({ success: true }));
  }
  
  /**
   * Notification methods
   */
  function getNotifications() {
    return simulateDelay().then(() => [...mockData.notifications]);
  }
  
  function markNotificationAsRead(id) {
    return simulateDelay().then(() => {
      const notification = mockData.notifications.find(n => n.id === id);
      if (notification) {
        notification.status = 'Read';
        return { success: true };
      }
      throw new Error('Notification not found');
    });
  }
  
  function deleteNotification(id) {
    return simulateDelay().then(() => {
      const index = mockData.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        mockData.notifications.splice(index, 1);
        return { success: true };
      }
      throw new Error('Notification not found');
    });
  }
  
  /**
   * Bills methods
   */
  function getBills() {
    return simulateDelay().then(() => [...mockData.bills]);
  }
  
  function submitBill(billData) {
    return simulateDelay(800).then(() => {
      const newBill = {
        id: mockData.bills.length + 1,
        ...billData,
        status: 'pending'
      };
      mockData.bills.push(newBill);
      return { success: true, bill: newBill };
    });
  }
  
  function approveBill(id) {
    return simulateDelay().then(() => {
      const bill = mockData.bills.find(b => b.id === id);
      if (bill) {
        bill.status = 'approved';
        return { success: true };
      }
      throw new Error('Bill not found');
    });
  }
  
  function rejectBill(id) {
    return simulateDelay().then(() => {
      const bill = mockData.bills.find(b => b.id === id);
      if (bill) {
        bill.status = 'rejected';
        return { success: true };
      }
      throw new Error('Bill not found');
    });
  }
  
  /**
   * Organizations methods
   */
  function getOrganizations() {
    return simulateDelay().then(() => [...mockData.organizations]);
  }
  
  function addOrganization(orgData) {
    return simulateDelay(800).then(() => {
      const newOrg = {
        id: `org-${mockData.organizations.length + 1}`,
        ...orgData,
        allocated: 0
      };
      mockData.organizations.push(newOrg);
      return { success: true, organization: newOrg };
    });
  }
  
  /**
   * Grants methods
   */
  function getGrants() {
    return simulateDelay().then(() => [...mockData.grants]);
  }
  
  function allocateGrant(grantData) {
    return simulateDelay(800).then(() => {
      // Add new grant
      const newGrant = {
        id: `alloc-${mockData.grants.length + 1}`,
        ...grantData,
        status: 'completed'
      };
      mockData.grants.push(newGrant);
      
      // Update organization allocated amount
      const org = mockData.organizations.find(o => o.id === grantData.organizationId);
      if (org) {
        org.allocated += grantData.amount;
      }
      
      return { success: true, grant: newGrant };
    });
  }
  
  /**
   * Expenses methods
   */
  function getExpenses() {
    return simulateDelay().then(() => [...mockData.expenses]);
  }
  
  function addExpense(expenseData) {
    return simulateDelay(800).then(() => {
      const newExpense = {
        id: mockData.expenses.length + 1,
        ...expenseData
      };
      mockData.expenses.push(newExpense);
      return { success: true, expense: newExpense };
    });
  }
  
  /**
   * Reports methods
   */
  function generateReport(reportParams) {
    return simulateDelay(1500).then(() => ({
      success: true,
      reportUrl: '#', // This would be a URL to download the report in Django
      message: 'Report generated successfully'
    }));
  }
  
  // Public API
  return {
    // Auth
    login,
    logout,
    
    // Notifications
    getNotifications,
    markNotificationAsRead,
    deleteNotification,
    
    // Bills
    getBills,
    submitBill,
    approveBill,
    rejectBill,
    
    // Organizations
    getOrganizations,
    addOrganization,
    
    // Grants
    getGrants,
    allocateGrant,
    
    // Expenses
    getExpenses,
    addExpense,
    
    // Reports
    generateReport
  };
})();
