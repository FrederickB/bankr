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
        $("#searchViewDate1").kendoDateTimePicker();
        $('#searchViewDate1').data('kendoDateTimePicker').value(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
        $("#searchViewDate2").kendoDateTimePicker();
        $('#searchViewDate2').data('kendoDateTimePicker').value(new Date());
    };
    var searchViewModel = kendo.observable({
        goBack: function () {
            $('a#navBarLogoutBtn').remove();
            app.mobileApp.navigate('components/home/view.html');
        },
        submit: function (event) {
            event.preventDefault();

            var id = $('#searchViewCategory').val();
            var startDate = $("#searchViewDate1").data("kendoDateTimePicker").value();
            var endDate = $("#searchViewDate2").data("kendoDateTimePicker").value();
            var dateLoop = new Date();
            var nom = $('#searchViewNom').val();
            var data2 = [];
            console.log(id);
            console.log(startDate);
            console.log(nom);
            expensesDataSource._data.forEach(function (expense) {

                var categoryCheckAll = ($('#searchViewCategory').val() === "All");
                var categoryCheck = ((expense.ExpenseCategory.Id === id));
                var dateCheck = ((expense.ExpenseDateTime < endDate && expense.ExpenseDateTime > startDate));
                var nomCheck = (expense.ExpenseName.toLowerCase().startsWith(nom));

                if (categoryCheck && nomCheck && dateCheck) {
                    var obj2 = {};
                    obj2.Id = expense.Id;
                    obj2.ExpenseDateTime = expense.ExpenseDateTime;
                    obj2.ExpenseName = expense.ExpenseName;
                    obj2.ExpenseCategory = expense.ExpenseCategory.CategoryName;
                    obj2.ExpenseAmount = parseFloat(parseFloat(expense.ExpenseAmount)).toFixed(2);
                    data2.push(obj2);
                } else if (categoryCheckAll && nomCheck && dateCheck){
                var obj2 = {};
                obj2.Id = expense.Id;
                obj2.ExpenseDateTime = expense.ExpenseDateTime;
                obj2.ExpenseName = expense.ExpenseName;
                obj2.ExpenseCategory = expense.ExpenseCategory.CategoryName;
                obj2.ExpenseAmount = parseFloat(parseFloat(expense.ExpenseAmount)).toFixed(2);
                data2.push(obj2);
            }

        });

    $("#searchResult").kendoMobileListView({
        dataSource: data2,
        template: '<div><strong>#: ExpenseName # - #: ExpenseCategory #</strong></div> <div>#: ExpenseDateTime # <span class="spending-list-right"><a data-role="button" href="components/editExpenseView/view.html?id=#: Id #">Edit</a></span></div><div>#: ExpenseAmount # $</div>'
    });

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