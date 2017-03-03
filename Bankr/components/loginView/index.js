'use strict';

app.loginView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('loginView');

// START_CUSTOM_CODE_loginView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

app.loginView = kendo.observable({
    submit: function() {
        if (!this.username) {
            navigator.notification.alert("Username is required.");
            return;
        }
        if (!this.password) {
            navigator.notification.alert("Password is required.");
            return;
        }
        app.data.backendServices.Users.login(this.username, this.password,
            function(data) {
                app.mobileApp.navigate("components/home/view.html");
            },
            function(err) {
                navigator.notification.alert("Unfortunately we could not find your account.");
            });
    },
    createUser: function(){
        app.mobileApp.navigate("components/createUserView/view.html");
    },
    forgotPassword: function(){
        app.mobileApp.navigate("components/forgotPasswordView/view.html");
    }
});

// END_CUSTOM_CODE_loginView