'use strict';
app.addGoalView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

app.localization.registerView('addGoalView');

// START_CUSTOM_CODE_addGoalView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function(parent){
    var addGoalViewModel = kendo.observable({
        goBack: function() {
            app.mobileApp.navigate('components/goalsView/view.html');
        },
        submit: function(event) {
            event.preventDefault();

            var title = this.goalTitle;
            var categoryId = this.selects;
            var amount = this.goalAmount;
            var dateTime = $('#goalDateTimeStart').val();
            var dateTimeEnd = $('#goalDateTimeEnd').val();

             if(!title){
                navigator.notification.alert('title is required');
                return;
            } 
            else if(!amount){
                navigator.notification.alert('Amount is required');
                return;
            } 
            else if(!categoryId){
                navigator.notification.alert('Category is required');
                return;
            }else if(!dateTime) {
                navigator.notification.alert('Date is required');
                return;
            }else if(!dateTimeEnd) {
                navigator.notification.alert('Date is required');
                return;
            }
            amount = parseFloat(parseFloat(amount).toFixed(2));

            var goal = {
                GoalCategory: categoryId,
                GoalStartDate: dateTime,
                GoalEndDate: dateTimeEnd,
                GoalAmount: amount,
                GoalTitle: title
            };

            goalsDataSource.add(goal);
            goalsDataSource.one('sync', addGoalViewModel.readAndClose);
            goalsDataSource.sync();
        },
        readAndClose: function () {
            goalsDataSource.read().then(function(){
                app.mobileApp.navigate('components/goalsView/view.html');
            });
        }
    });

    parent.onShow = function() {
        $('#goalAmount').val('');
        $('#goalTitle').val('');
        $('#addGoalCategories').val($('#addGoalCategories option:first').val());
        $('#goalDateTimeStart').val('');
        $('#goalDateTimeEnd').val('');
    };

    parent.addGoalViewModel = addGoalViewModel;
})(app.addGoalView);

function initAddGoalView(){
    $('#goalDateTimeStart').kendoDateTimePicker({
        value: new Date()
    });
    $('#goalDateTimeEnd').kendoDateTimePicker({
        value: new Date()
     });

    categoriesDataSource._data.forEach(function(category){
        $('#addGoalCategories').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
}
// END_CUSTOM_CODE_addGoalView