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

        $('#editExpenseName').val(currentExpense.ExpenseName);
        $('#editExpenseDate').data('kendoDateTimePicker').value(new Date(currentExpense.ExpenseDateTime));
        $('#editExpenseAmount').val(parseFloat(currentExpense.ExpenseAmount).toFixed(2));
        $('#editExpenseCate option[value="' + currentExpense.ExpenseCategory.Id + '"]').attr('selected', 'selected');
    };

    var editExpenseViewModel = kendo.observable({
        goBack: function () {
            app.mobileApp.navigate('#:back');
        },

        submit: function (event) {
            event.preventDefault();

            var id = parent.id;
            var currentExpense = expensesDataSource.get(id);

            if ($('#editExpenseName').val().trim() === '') {
                navigator.notification.alert("Name is required");
                return;
            } else if ($('#editExpenseAmount').val() === '') {
                navigator.notification.alert("Amount is required");
                return;
            }
            this.Amount = parseFloat(parseFloat(this.Amount).toFixed(2));
            currentExpense.set('ExpenseName', this.editExpenseName);
            currentExpense.set('ExpenseAmount', this.editExpenseAmount);
            currentExpense.set('ExpenseCategory', this.editExpenseCate);
            currentExpense.set('ExpenseDateTime', this.editExpenseDate);

            expensesDataSource.one('sync', editExpenseViewModel.readAndClose);
            expensesDataSource.sync();
        },
        readAndClose: function () {
            expensesDataSource.read().then(function () {
                app.mobileApp.navigate('#:back');
            });
        }
    });

    parent.editExpenseViewModel = editExpenseViewModel;
})(app.editExpenseView);

function initEdiExpenseView() {
    $('#editExpenseDate').kendoDateTimePicker({
        value: new Date()
    });

    categoriesDataSource._data.forEach(function (category) {
        $('#editExpenseCate').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
}

// END_CUSTOM_CODE_editExpenseView