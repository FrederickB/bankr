'use strict';

app.spendingView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('spendingView');

// START_CUSTOM_CODE_spendingView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function(parent){
    var viewModel = kendo.observable({
        editExpense: function(event){
            var id = event.target[0].getAttribute('itemid');
            app.editExpenseView.set('id', id);
            app.mobileApp.navigate('components/editExpenseView/view.html');
        },
        openAddExpenseView : function(){
            app.mobileApp.navigate('components/addExpenseView/view.html');
        }
    });

    parent.spendingViewModel = viewModel;

    parent.onShow = function() {
        var data = [];

        expensesDataSource._data.forEach(function(expense){
            var obj = {};
            obj.Id = expense.Id;
            obj.ExpenseDateTime = new Date(expense.ExpenseDateTime);
            obj.ExpenseName = expense.ExpenseName;
            obj.ExpenseCategory = expense.ExpenseCategory.CategoryName;
            obj.ExpenseAmount = expense.ExpenseAmount.toFixed(2);
            data.push(obj);
        });

        data.sort(function(a,b){
            return new Date(b.ExpenseDateTime) - new Date(a.ExpenseDateTime); 
        });

        $("#spending-list").kendoMobileListView({
            dataSource: data,
            template: '<div><strong>#: ExpenseName #</strong></div><div>#: ExpenseCategory # - #: ExpenseDateTime.toDateString() # <span class="spending-list-right"><a data-role="button" data-icon="compose" data-bind="click: editExpense" itemid="#: Id #"></a></span></div><div>#: ExpenseAmount # $</div>'
        });

        kendo.bind($('#spending-list li a'), viewModel);
    };
})(app.spendingView);

// END_CUSTOM_CODE_spendingView