app.goalsView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('goalsView');

// START_CUSTOM_CODE_goalsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function (parent) {
    var goalsViewModel = kendo.observable({
        editGoal: function (event) {
            var id = event.target[0].getAttribute('itemid');
            app.editGoalView.set('id', id);
            app.mobileApp.navigate('components/editGoalView/view.html');
        },
        openAddGoalView: function(){
            console.log("click!");
            app.mobileApp.navigate('components/addGoalView/view.html');
        }
    });

    parent.goalsViewModel = goalsViewModel;

    parent.onShow = function () {
        var data = [];
        goalsDataSource._data.forEach(function (goal) {
            var obj = {};
            obj.GoalAmount = goal.GoalAmount;
            obj.GoalCategory = goal.GoalCategory.CategoryName;
            var sum = 0;
            expensesDataSource._data
                .filter(function (expense) {
                    if (expense.ExpenseDateTime < goal.GoalEndDate && expense.ExpenseDateTime > goal.GoalStartDate){
                        return expense.ExpenseCategory.Id === goal.GoalCategory.Id;
                    }
                })
                .forEach(function (expense) {
                    sum += expense.ExpenseAmount;
                });

            obj.ExpenseAmount = sum;
            obj.GoalTitle = goal.GoalTitle;
            obj.GoalStartDate = goal.GoalStartDate;
            obj.GoalEndDate = goal.GoalEndDate;
            obj.Id = goal.Id;
            data.push(obj);
        })
        $("#goals-list").kendoMobileListView({
            dataSource: data,
            template: '<div><strong>#: GoalTitle # - #: GoalCategory #</strong></div><div><span style="float:right"><a data-role="button" data-icon="compose" data-bind="click: editGoal" itemid="#: Id #"></a></span></div><div></div><div><strong>#: (parseFloat(Math.round(ExpenseAmount * 100) /100).toFixed(2)) #$ / #: (parseFloat(Math.round(GoalAmount * 100) /100).toFixed(2)) #$</strong></div><div>From #: GoalStartDate # to #: GoalEndDate #</div>'
        });

        kendo.bind($('#goals-list li a'), goalsViewModel);
    }
})(app.goalsView);
// END_CUSTOM_CODE_goalsView