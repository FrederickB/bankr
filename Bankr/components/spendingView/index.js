'use strict';

app.spendingView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('spendingView');

// START_CUSTOM_CODE_spendingView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function(parent){
    parent.onShow = function() {
        var data = [];

        expensesDataSource._data.forEach(function(expense){
            var obj = {};
            obj.Id = expense.Id;
            obj.CreatedAt = expense.CreatedAt;
            obj.ExpenseName = expense.ExpenseName;
            obj.ExpenseCategory = expense.ExpenseCategory.CategoryName;
            obj.ExpenseAmount = Math.round(parseFloat(expense.ExpenseAmount)).toFixed(2);
            data.push(obj);
        });

        $("#spending-list").kendoMobileListView({
            dataSource: data,
            template: '<div><strong>#: ExpenseName #</strong></div><div>#: ExpenseCategory # - #: CreatedAt.toDateString() # <span class="spending-list-right"><a data-role="button" href="components/editExpenseView/view.html?id=#: Id #">Edit</a></span></div><div>#: ExpenseAmount # $</div>'
        });
    };
})(app.spendingView);

// END_CUSTOM_CODE_spendingView