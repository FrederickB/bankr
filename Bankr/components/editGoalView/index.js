'use strict';

app.editGoalView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('editGoalView');

// START_CUSTOM_CODE_editGoalView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function (parent) {
    parent.onShow = function () {
        var id = parent.id;
        var currentGoal = goalsDataSource.get(id);
        $('#amount').val(parseFloat(currentGoal.GoalAmount).toFixed(2));
        $('#editGoalCategories option[value="' + currentGoal.GoalCategory.Id + '"]').attr('selected', 'selected');

    };
    var editGoalViewModel = kendo.observable({
        goBack: function () {
            app.mobileApp.navigate('components/goalsView/view.html');
        },

        submit: function (event) {
            event.preventDefault();

            var id = parent.id;
            var currentGoal = goalsDataSource.get(id);
            currentGoal.set('GoalAmount', $('#amount').val());
            currentGoal.set('GoalCategory',$('#editGoalCategories').val());

            goalsDataSource.one('sync', editGoalViewModel.readAndClose);
            goalsDataSource.sync();
        },
        readAndClose: function () {
            goalsDataSource.read().then(function(){
                app.mobileApp.navigate('components/goalsView/view.html');
            });
        }
    });
    parent.editGoalViewModel = editGoalViewModel;
})(app.editGoalView);

function initEditGoalView() {
    categoriesDataSource._data.forEach(function (category) {
        $('#editGoalCategories').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
}
// END_CUSTOM_CODE_editGoalView