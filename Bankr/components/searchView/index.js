'use strict';

app.searchView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('searchView');

// START_CUSTOM_CODE_searchView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

(function (parent) {
    parent.onShow = function () {
        $("#formSearchView").show();
        $("#searchResult").hide();
        $("#searchViewDate1").kendoDateTimePicker();
        $('#searchViewDate1').data('kendoDateTimePicker').value(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
        $("#searchViewDate2").kendoDateTimePicker();
        $('#searchViewDate2').data('kendoDateTimePicker').value(new Date());

    };
    var searchViewModel = kendo.observable({
        editExpense: function (event) {
            var id = event.target[0].getAttribute('itemid');
            app.editExpenseView.set('id', id);
            app.mobileApp.navigate('components/editExpenseView/view.html');
        },
        goBack: function () {
            app.mobileApp.navigate('components/spendingView/view.html');
        },
        submit: function (event) {
            event.preventDefault();

            var id = $('#searchViewCategory').val();
            var startDate = $("#searchViewDate1").data("kendoDateTimePicker").value();
            var endDate = $("#searchViewDate2").data("kendoDateTimePicker").value();
            var nom = $('#searchViewNom').val();
            var data2 = [];

            expensesDataSource._data.forEach(function (expense) {
                var categoryCheckAll = ($('#searchViewCategory').val() === "All");
                var categoryCheck = ((expense.ExpenseCategory.Id === id));
                var dateCheck = ((new Date(expense.ExpenseDateTime) < endDate && new Date(expense.ExpenseDateTime) > startDate));
                var nomCheck = (expense.ExpenseName.toLowerCase().startsWith(nom));

                if (categoryCheckAll && nomCheck && dateCheck) {
                    var obj2 = {};
                    obj2.Id = expense.Id;
                    obj2.ExpenseDateTime = new Date(expense.ExpenseDateTime);
                    obj2.ExpenseName = expense.ExpenseName;
                    obj2.ExpenseCategory = expense.ExpenseCategory.CategoryName;
                    obj2.ExpenseAmount = parseFloat(parseFloat(expense.ExpenseAmount)).toFixed(2);
                    data2.push(obj2);
                }
                else if (categoryCheck && nomCheck && dateCheck) {
                    var obj2 = {};
                    obj2.Id = expense.Id;
                    obj2.ExpenseDateTime = new Date(expense.ExpenseDateTime);
                    obj2.ExpenseName = expense.ExpenseName;
                    obj2.ExpenseCategory = expense.ExpenseCategory.CategoryName;
                    obj2.ExpenseAmount = parseFloat(parseFloat(expense.ExpenseAmount)).toFixed(2);
                    data2.push(obj2);
                }
            });

            data2.sort(function(a, b){
                return new Date(b.ExpenseDateTime) - new Date(a.ExpenseDateTime);
            });

            $("#searchResult").kendoMobileListView({
                dataSource: data2,
                template: '<div><strong>#: ExpenseName #</strong></div><div>#: ExpenseCategory # - #: ExpenseDateTime.toDateString() # <span class="spending-list-right"><a data-role="button" data-icon="compose" data-bind="click: editExpense" itemid="#: Id #"></a></span></div><div>#: ExpenseAmount # $</div>'
            });
            kendo.bind($('#searchResult li a'), searchViewModel);
            $("#formSearchView").hide();
            $("#searchResult").show();
        }
    });
    parent.searchViewModel = searchViewModel;
})
    (app.searchView);

function initSearchView() {
    $('#searchViewCategory').append('<option value="All">All</option>');
    categoriesDataSource._data.forEach(function (category) {
        $('#searchViewCategory').append('<option value="' + category.Id + '">' + category.CategoryName + '</option>');
    });
    var dateTest = new Date();
    $('#searchViewCategory').val("All");
    $('#searchViewNom').val("");
    $('#searchViewDate1').kendoDateTimePicker({
        value: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
    });
    $('#searchViewDate2').kendoDateTimePicker({
        value: new Date()
    });

}

// END_CUSTOM_CODE_searchView