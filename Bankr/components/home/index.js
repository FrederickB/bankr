'use strict';

app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

app.home = kendo.observable({
    logout: function(event) {
        // Prevent going to the login page until the login call processes.
        event.preventDefault();
        $('a#navBarLogoutBtn').remove();
        app.data.backendServices.Users.logout(function() {
            app.loginView.set('username', '');
            app.loginView.set('password', '');
            app.mobileApp.navigate('components/loginView/view.html');
        }, function() {
            navigator.notification.alert('Unfortunately an error occurred logging out of your account.');
        });
    },
    openAddExpense: function() {
        app.mobileApp.navigate('components/addExpenseView/view.html');
    }
});

// END_CUSTOM_CODE_home