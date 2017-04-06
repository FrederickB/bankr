'use strict';

app.editExpenseView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('editExpenseView');

// START_CUSTOM_CODE_editExpenseView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
(function (parent) {
    parent.onShow = function () {
        var id = parent.id;
        var currentExpense = expensesDataSource.get(id);

        $('#Name').val(currentExpense.ExpenseName);
        $('#Date').data('kendoDateTimePicker').value(new Date(currentExpense.ExpenseDateTime));
        $('#Amount').val(parseFloat(currentExpense.ExpenseAmount).toFixed(2));
        $('#Select option[value="' + currentExpense.ExpenseCategory.Id + '"]').attr('selected', 'selected');
    };
    var editExpenseViewModel = kendo.observable({
        goBack: function () {
            app.mobileApp.navigate('components/spendingView/view.html');
        },

        submit: function (event) {
            event.preventDefault();
            console.log('stil working');

            var id = parent.id;
            var currentExpense = expensesDataSource.get(id);

            if ($('#Name').val().trim() === '') {
                navigator.notification.alert("Name is required");
                return;
            } else if ($('#Amount').val() === '') {
                navigator.notification.alert("Amount is required");
                return;
            }
            this.Amount = parseFloat(parseFloat(this.Amount).toFixed(2));
            currentExpense.set('ExpenseName', this.Name);
            currentExpense.set('ExpenseAmount', this.Amount);
            currentExpense.set('ExpenseCategory', this.Category);
            currentExpense.set('ExpenseDateTime', this.Date);
            console.log('done');
            expensesDataSource.one('sync', editExpenseViewModel.readAndClose);
            expensesDataSource.sync();
        },
        readAndClose: function () {
            expensesDataSource.read().then(function(){
                app.mobileApp.navigate('components/spendingView/view.html');
            });
        }
    });

    parent.editExpenseViewModel = editExpenseViewModel;
})(app.editExpenseView);

function initEdiExpenseView() {
    $('#Date').kendoDateTimePicker({
        value: new Date()
    });

    categoriesDataSource._data.forEach(function (category) {
        $('#Select').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
}

// END_CUSTOM_CODE_editExpenseView