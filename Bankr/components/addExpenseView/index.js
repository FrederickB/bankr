'use strict';

app.addExpenseView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});
app.localization.registerView('addExpenseView');

// START_CUSTOM_CODE_addExpenseView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

app.addExpenseView = kendo.observable({
    onShow: function() {
        $('#expenseName').val('');
        $('#expenseAmount').val('');
        $('#expenseCategory').val($('#expenseCategory option:first').val());

        var datepicker = $('#expenseDateTime').data('kendoDateTimePicker');
        datepicker.value(new Date());
    },
    goBack: function() {
        $('a#navBarLogoutBtn').remove();
        app.mobileApp.navigate('components/home/view.html');
    },
    submit: function(event) {
        event.preventDefault();

        var name = this.expenseName;
        var amount = this.expenseAmount;
        var categoryId = $('#expenseCategory').val();
        var dateTime = $('#expenseDateTime').val();

        if(!name || name.trim() === ''){
            navigator.notification.alert('Name is required');
            return;
        } else if(!amount){
            navigator.notification.alert('Amount is required');
            return;
        } else if(!categoryId){
            navigator.notification.alert('Category is required');
            return;
        }else if(!dateTime) {
            navigator.notification.alert('Date is required');
            return;
        }

        amount = parseFloat(parseFloat(amount).toFixed(2));

        var expense = {
            ExpenseCategory: categoryId,
            ExpenseDateTime: dateTime,
            ExpenseAmount: amount,
            ExpenseName: name
        };

        expensesDataSource.add(expense);
        expensesDataSource.one('sync', this.close);
        expensesDataSource.sync();
    },
    close: function () {
        app.mobileApp.navigate('components/home/view.html');
    }
});

function initAddExpenceView(){
    $('#expenseDateTime').kendoDateTimePicker({
        value: new Date()
    });

    categoriesDataSource._data.forEach(function(category){
        $('#expenseCategory').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
}

// END_CUSTOM_CODE_addExpenseView