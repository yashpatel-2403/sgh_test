// document.addEventListener("DOMContentLoaded", function() {
//     // ✅ Handle Login
//     const loginForm = document.getElementById("loginForm");
//     if (loginForm) {
//         loginForm.addEventListener("submit", function(event) {
//             event.preventDefault();
//             const username = document.getElementById("username").value;
//             const password = document.getElementById("password").value;

//             if (username === "admin" && password === "admin123") {
//                 localStorage.setItem("userRole", "admin");
//                 window.location.href = "admin_dashboard.html";
//             } else {
//                 localStorage.setItem("userRole", "user");
//                 window.location.href = "user_dashboard.html";
//             }
//         });
//     }
document.addEventListener("DOMContentLoaded", function() {
    
    // handle login
    
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const role = document.getElementById("role").value;
            const errorMessage = document.getElementById("error-message");

            // Dummy credentials for validation
            const adminCredentials = { username: "admin", password: "admin123" };
            const userCredentials = { username: "user", password: "user123" };

            let isAuthenticated = false;

            if (role === "admin" && username === adminCredentials.username && password === adminCredentials.password) {
                isAuthenticated = true;
                localStorage.setItem("userRole", "admin");
                window.location.href = "admin_dashboard.html";
            } else if (role === "user" && username === userCredentials.username && password === userCredentials.password) {
                isAuthenticated = true;
                localStorage.setItem("userRole", "user");
                window.location.href = "user_dashboard.html";
            }

            if (!isAuthenticated) {
                errorMessage.textContent = "Invalid credentials. Please try again.";
            }
        });
    }

    // Redirect unauthorized users
    if (window.location.pathname.includes("admin_dashboard.html") && localStorage.getItem("userRole") !== "admin") {
        window.location.href = "login.html";
    }
    if (window.location.pathname.includes("user_dashboard.html") && localStorage.getItem("userRole") !== "user") {
        window.location.href = "login.html";
    }

    // Logout functionality
    if (window.location.pathname.includes("logout.html")) {
        localStorage.clear();
        window.location.href = "login.html";
    }





    // ✅ Check for User Role & Redirect If Needed
    if (window.location.pathname.includes("admin_dashboard.html") && localStorage.getItem("userRole") !== "admin") {
        window.location.href = "login.html";
    }
    if (window.location.pathname.includes("user_dashboard.html") && localStorage.getItem("userRole") !== "user") {
        window.location.href = "login.html";
    }

    // ✅ Approve / Reject Bills
    const pendingBills = document.getElementById("pendingBills");
    if (pendingBills) {
        pendingBills.innerHTML = "<tr><td>XYZ School</td><td>5000</td><td>2025-03-25</td><td><button onclick='approveBill()'>Approve</button> <button onclick='rejectBill()'>Reject</button></td></tr>";
    }

    window.approveBill = function() {
        alert("Bill Approved!");
        window.location.reload();
    };

    window.rejectBill = function() {
        let reason = prompt("Enter rejection reason:");
        if (reason) alert("Bill Rejected! Reason: " + reason);
        window.location.reload();
    };

    // ✅ Allocate Grants
    const grantForm = document.getElementById("grantForm");
    if (grantForm) {
        grantForm.addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Grant Allocated Successfully!");
            window.location.reload();
        });
    }

    // ✅ Log Expenses
    const expenseForm = document.getElementById("expenseForm");
    if (expenseForm) {
        expenseForm.addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Expense Logged Successfully!");
            window.location.reload();
        });
    }

    // ✅ Generate Reports
    const reportForm = document.getElementById("reportForm");
    if (reportForm) {
        reportForm.addEventListener("submit", function(event) {
            event.preventDefault();
            alert("Report Generated!");
        });
    }

    // ✅ Add Organizations
    const orgForm = document.getElementById("orgForm");
    const orgList = document.getElementById("orgList");
    if (orgForm && orgList) {
        orgForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const orgName = document.getElementById("orgName").value;
            const contactInfo = document.getElementById("contactInfo").value;
            const totalBudget = document.getElementById("totalBudget").value;

            const listItem = document.createElement("li");
            listItem.innerHTML = `${orgName} - ${contactInfo} - Budget: ${totalBudget}`;
            orgList.appendChild(listItem);

            orgForm.reset();
        });
    }

    // ✅ Display Notifications
    const notificationsList = document.getElementById("notificationsList");
    if (notificationsList) {
        notificationsList.innerHTML = "<li>Bill Approved for XYZ School</li><li>Grant Allocated to ABC Organization</li>";
    }

    // ✅ Logout
    if (window.location.pathname.includes("logout.html")) {
        localStorage.clear();
        window.location.href = "login.html";
    }

});