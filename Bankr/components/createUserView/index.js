'use strict';

app.createUserView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('createUserView');

// START_CUSTOM_CODE_createUserView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

app.createUserView = kendo.observable({
    submit: function () {
        if (!this.username) {
            navigator.notification.alert("Username is required.");
            return;
        }
        if (!this.password) {
            navigator.notification.alert("Password is required.");
            return;
        }
        app.data.backendServices.Users.register(this.username, this.password, { Email: this.email },
            function () {
                navigator.notification.alert("Your account was successfully created.");
                app.mobileApp.navigate("components/loginView/view.html");
            },
            function () {
                navigator.notification.alert("Unfortunately we were unable to create your account.");
            });
    }
});

// END_CUSTOM_CODE_createUserView