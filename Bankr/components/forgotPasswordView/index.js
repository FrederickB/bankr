'use strict';

app.forgotPasswordView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('forgotPasswordView');

// START_CUSTOM_CODE_forgotPasswordView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function (parent) {
    var forgotPasswordViewModel = kendo.observable({
        submit: function () {
            if (!this.email) {
                navigator.notification.alert("Email address is required.");
                return;
            }
            $.ajax({
                type: "POST",
                url: "https://api.everlive.com/v1/" + app.data.backendServices.setup.appId + "/Users/resetpassword",
                contentType: "application/json",
                data: JSON.stringify({
                    Email: this.email
                }),
                success: function () {
                    navigator.notification.alert("Your password was successfully reset. Please check your email for instructions on choosing a new password.");
                    app.mobileApp.navigate("components/loginView/view.html");
                },
                error: function () {
                    navigator.notification.alert("Unfortunately, an error occurred while resetting your password.")
                }
            });
        },
        goBack: function() {
            app.mobileApp.navigate('components/loginView/view.html');
        }
    });

    parent.forgotPasswordViewModel = forgotPasswordViewModel;
})(app.forgotPasswordView);

// END_CUSTOM_CODE_forgotPasswordView