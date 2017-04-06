app.home = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('home');

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function(parent){
    var homeModel = kendo.observable({
        logout: function(event) {
            // Prevent going to the login page until the login call processes.
            event.preventDefault();

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
        },
        showCurrentExpenseAmount: function(lapse) {
            var total = 0;

            expensesDataSource._data.filter(function(expense){
                var date1 = new Date();
                var date2 = new Date(expense.ExpenseDateTime);
                var dateLapse = parseInt((date1 - date2) / (1000 * 60 * 60 * 24));
                return dateLapse <= lapse.days;
            }).forEach(function(expense){
                total += expense.ExpenseAmount;
            });
            total = total.toFixed(2);
            $("#displayed-spending-amount").text(total + "$");
            $("#displayed-spending-type").text(lapse.text);
        },
        showPreviousDataLapseType: function(){
            parent.lapseIndex = (parent.lapseIndex + parent.lapse.length - 1) % parent.lapse.length
            homeModel.showCurrentExpenseAmount(parent.lapse[parent.lapseIndex]);
        },
        showNextDataLapseType: function(){
            parent.lapseIndex = (parent.lapseIndex + 1) % parent.lapse.length
            homeModel.showCurrentExpenseAmount(parent.lapse[parent.lapseIndex]);
        }
    });

    parent.homeModel = homeModel;

    parent.onShow = function() {
        var currentLapse = parent.lapse[parent.lapseIndex];
        homeModel.showCurrentExpenseAmount(currentLapse);
    }
})(app.home);

function initHomeView(){
    app.home.lapse = [
        { text: "Today", days: 0 },
        { text: "Last 7 days", days: 6 },
        { text: "Last 14 days", days: 13 },
        { text: "Last 30 days", days: 29 },
        { text: "Last 365 days", days: 364 }
    ];
    app.home.lapseIndex = 0;
}

// END_CUSTOM_CODE_home