'use strict';

app.statsView = kendo.observable({
    onShow: function () { },
    afterShow: function () { }
});
app.localization.registerView('statsView');

// START_CUSTOM_CODE_statsView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

//Initialization de la vue
function initStatsView() {
    // Initialization du MultiSelect contenant toutes les categories
    $('#catSelect').kendoMultiSelect({
        dataTextField: 'CategoryName',
        dataValueField: 'Id',
        dataSource: new kendo.data.DataSource({ data: categoriesDataSource.data() }),
        autoClose: false,
        change: changeInterval
    });
    // Initialization du DropDownList pour selectionner l'interval
    $('#selectInterval').kendoDropDownList({
        change: changeInterval
    });
    // Afficher 0$ à l'initialisation
    $('#totalCourantInterval').text('0.00$');
}

// Est appeler lorsque l'interval est change
function changeInterval() {
    var interval = $('#selectInterval option:selected').text();
    var categoriesValues = $('#catSelect').val();
    if (categoriesValues) {
        switch (interval) {
            case 'Today':
                var dsInterval = intervalDaily();
                var result = expensesByCategories(dsInterval, categoriesValues);
                var total = getExpensesSum(result);
                var categoriesTotals = sumByCategories(result, categoriesValues, total);
                $('#totalCourantInterval').text(total + '$');
                createChart(categoriesTotals);
                break;
            case 'Last 7 days':
                //$('#totalCourantInterval').text(intervalWeekly(categoriesValues) + '$');
                var dsInterval = intervalWeekly();
                var result = expensesByCategories(dsInterval, categoriesValues);
                var total = getExpensesSum(result);
                var categoriesTotals = sumByCategories(result, categoriesValues, total);
                $('#totalCourantInterval').text(total + '$');
                createChart(categoriesTotals);
                break;
            case 'Last 30 days':
                var dsInterval = intervalMonthly();
                var result = expensesByCategories(dsInterval, categoriesValues);
                var total = getExpensesSum(result);
                var categoriesTotals = sumByCategories(result, categoriesValues, total);
                $('#totalCourantInterval').text(total + '$');
                createChart(categoriesTotals);
                break;
            case 'Last year':
                var dsInterval = intervalYearly();
                var result = expensesByCategories(dsInterval, categoriesValues);
                var total = getExpensesSum(result);
                var categoriesTotals = sumByCategories(result, categoriesValues, total);
                $('#totalCourantInterval').text(total + '$');
                createChart(categoriesTotals);
                break;
            default:
                alert('You need to select an interval!');
        }
    } else {
        $('#totalCourantInterval').text('0.00$');
    }
}

// Afficher montant selon interval 'Daily' et les categories choisises
function intervalDaily() {
    // Date courrante
    var currDate = new Date();
    // Trouver toutes les depenses ayant la date courrante (ajd)
    var dsDaily = new kendo.data.DataSource({
        data: expensesDataSource.data(),
        filter: {
            logic: 'and',
            filters: [{
                field: 'ExpenseDateTime',
                operator: function (item, value) {
                    // On ignore les heures, minutes, secondes, milisecondes des deux dates
                    var date1 = new Date(item);
                    date1.setHours(0, 0, 0, 0);
                    var date2 = new Date(value);
                    date2.setHours(0, 0, 0, 0);
                    // On compare les deux dates
                    return date1.getTime() === date2.getTime();
                },
                value: currDate
            }]
        }
    });
    // Retourne le DataSource contenant toutes les depenses du jour
    var view;
    dsDaily.fetch(function () {
        view = this.view();
    });
    var dsFinal = new kendo.data.DataSource({ data: view });
    dsFinal.read();
    return dsFinal;
}

function intervalWeekly(categoriesValues) {
    // Date courrante
    var currDate = new Date();
    // Trouver toutes les depenses ayant la date courrante (ajd)
    var dsYearly = new kendo.data.DataSource({
        data: expensesDataSource.data(),
        filter: {
            logic: 'and',
            filters: [{
                field: 'ExpenseDateTime',
                operator: function (item, value) {
                    // On ignore les heures, minutes, secondes, milisecondes des deux dates
                    // Date1 -> date de l'achat
                    var date1 = new Date(item);
                    date1.setHours(0, 0, 0, 0);
                    // Date2 -> date du jour
                    var date2 = new Date(value);
                    date2.setHours(0, 0, 0, 0);
                    // Date3 -> date d'il y a une semaine
                    var date3 = new Date(value);
                    date3.setDate(date3.getDate() - 6);
                    date3.setHours(0, 0, 0, 0);
                    // On compare les dates (la date de la depense doit etre dans le derniers 7 jours)
                    if (date1 <= date2 && date1 >= date3) {
                        return true;
                    } else {
                        return false;
                    }
                },
                value: currDate
            }]
        }
    });
    // Retourne le DataSource contenant toutes les depenses de l'annee
    var view;
    dsYearly.fetch(function () {
        view = this.view();
    });
    var dsFinal = new kendo.data.DataSource({ data: view });
    dsFinal.read();
    return dsFinal;
}

function intervalMonthly() {
    // Date courrante
    var currDate = new Date();
    // Trouver toutes les depenses ayant la date courrante (ajd)
    var dsMonthly = new kendo.data.DataSource({
        data: expensesDataSource.data(),
        filter: {
            logic: 'and',
            filters: [{
                field: 'ExpenseDateTime',
                operator: function (item, value) {
                    // On ignore les heures, minutes, secondes, milisecondes des deux dates
                    // Date de la dépense
                    var date1 = new Date(item);
                    date1.setHours(0, 0, 0, 0);
                    // Date d'ajd
                    var date2 = new Date(value);
                    date2.setHours(0, 0, 0, 0);
                    // Date d'il y a 30 jours'
                    var date3 = new Date(value);
                    date3.setDate(date3.getDate() - 30);
                    date3.setHours(0, 0, 0, 0);
                    // On compare les dates
                    if (date1 <= date2 && date1 >= date3) {
                        return true;
                    } else {
                        return false;
                    }
                },
                value: currDate
            }]
        }
    });
    // Retourne le DataSource contenant toutes les depenses du mois
    var view;
    dsMonthly.fetch(function () {
        view = this.view();
    });
    var dsFinal = new kendo.data.DataSource({ data: view });
    dsFinal.read();
    return dsFinal;
}

function intervalYearly() {
    // Date courrante
    var currDate = new Date();
    // Trouver toutes les depenses ayant la date courrante (ajd)
    var dsYearly = new kendo.data.DataSource({
        data: expensesDataSource.data(),
        filter: {
            logic: 'and',
            filters: [{
                field: 'ExpenseDateTime',
                operator: function (item, value) {
                    // On ignore les mois, les jours, les heures, minutes, secondes, milisecondes des deux dates
                    // Date1 -> date de l'achat
                    var date1 = new Date(item);
                    date1.setHours(0, 0, 0, 0);
                    // Date2 -> date du jour
                    var date2 = new Date(value);
                    date2.setHours(0, 0, 0, 0);
                    // Date3 -> date d'il y a un an
                    var date3 = new Date(value);
                    date3.setHours(0, 0, 0, 0);
                    date3.setYear(date3.getYear() - 1);
                    // On compare les dates
                    if (date1 <= date2 && date1 >= date3) {
                        return true;
                    } else {
                        return false;
                    }
                },
                value: currDate
            }]
        }
    });
    // Retourne le DataSource contenant toutes les depenses de l'annee
    var view;
    dsYearly.fetch(function () {
        view = this.view();
    });
    var dsFinal = new kendo.data.DataSource({ data: view });
    dsFinal.read();
    return dsFinal;
}

// Additione et retourne la somme des depenses selon l'interval et les categories
function getExpensesSum(ds) {
    // On copie les donnees du DataSource repondant au filtre
    var view;
    ds.fetch(function () {
        view = ds.view();
    });
    // DataSource contenant les donnees repondant au filtre qui seront additionnees
    var dsSum = new kendo.data.DataSource({
        data: view,
        aggregate: [
            { field: 'ExpenseAmount', aggregate: 'sum' }
        ]
    });
    var total;
    dsSum.fetch(function () {
        total = dsSum.aggregates().ExpenseAmount;
    });
    // Retourne la somme
    var result = (total.sum).toFixed(2);
    return result;
}

// Retourne toutes les depenses ayant les categories chosis
// Recoi un dataSource contenant une liste de depenses // Recoi un array contenant les id des categories choisis
function expensesByCategories(ds, categories) {
    // Liste des depenses (dataSource)
    var dsExpensesInterval = ds;
    // Liste des categories (array)
    var categoryList = categories;
    var result = [];
    categoryList.forEach(function (category) {
        var ds = new kendo.data.DataSource({
            data: dsExpensesInterval.data(),
            filter: {
                logic: 'and',
                filters: [{
                    field: 'ExpenseCategory.Id',
                    operator: 'eq',
                    value: category
                }]
            }
        });
        var view;
        ds.fetch(function () {
            view = this.view();
        });
        var resultCat = view;
        resultCat = resultCat.toJSON();
        result.push.apply(result, resultCat);
    });
    var dsResult = new kendo.data.DataSource({
        data: result
    });
    dsResult.read();
    return dsResult;
}

// Retourne un tableau contenant le total des depenses par categories
// Recoi un dataSource contenant des depenses
function sumByCategories(ds, categories, grandTotal) {
    var result = [];
    categories.forEach(function (categoryId) {
        // On s'assure de trouver le nom de la categorie meme s'il n'y a pas de depenses
        var categoryName;
        var dsCategoryName = new kendo.data.DataSource({
            data: categoriesDataSource.data(),
            filter: {
                logic: 'and',
                filters: [{
                    field: 'Id',
                    operator: 'eq',
                    value: categoryId
                }]
            }
        });
        var viewCategoryName;
        dsCategoryName.fetch(function () {
            viewCategoryName = this.view();
        });
        categoryName = viewCategoryName[0].CategoryName;
        var dsExpenses = new kendo.data.DataSource({
            data: ds.data(),
            filter: {
                logic: 'and',
                filters: [{
                    field: 'ExpenseCategory.Id',
                    operator: 'eq',
                    value: categoryId
                }]
            }
        });
        var view;
        dsExpenses.fetch(function () {
            view = this.view();
        });
        if (view[0]) {
            var total = 0.0;
            view.forEach(function (item) {
                total = total + item.ExpenseAmount;
            });
            total = (total / grandTotal) * 100.0;
        } else {
            var total = 0.0;
        }
        var totalFixed = total.toFixed(0);
        var categoryNameAndTotal = { 'category': categoryName, 'percentage': totalFixed };
        result.push(categoryNameAndTotal);
    });
    return result;
}

// Cree le PieChart selon l'interval et les categories choisis
function createChart(categoriesPercentage) {
    $("#chart").kendoChart({
        title: {
            position: 'top',
            text: 'Expenses by Categories and Interval',
            color: 'black'
        },
        legend: {
            position: 'bottom',
            visible: true
        },
        dataSource: categoriesPercentage,
        chartArea: {
            background: ''
        },
        series: [{
            type: 'pie',
            field: 'percentage',
            categoryField: 'category'
        }],
        tooltip: {
            visible: true,
            template: "#= category # - #= kendo.format('{0:P}', percentage) #"
        }
    });
}
// END_CUSTOM_CODE_statsView