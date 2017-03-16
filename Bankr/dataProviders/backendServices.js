'use strict';

(function() {
    var provider = app.data.backendServices = new Everlive({
        appId: '3h18m5qpqk1rmtqv',
        scheme: 'https',
        authentication: {
            persist: true
        }
    });

}());

// START_CUSTOM_CODE_backendServices
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes
var categoriesDataSource = new kendo.data.DataSource({
    type: "everlive",
    transport: {
        typeName: "Categories"
    }
});
var expensesDataSource = new kendo.data.DataSource({
    type: "everlive",
    transport: {
        typeName: "Expenses",
        read: {
            contentType: "application/json",
            headers: {
                "X-Everlive-Expand": JSON.stringify({
                    "ExpenseCategory": {
                        "TargetTypeName": "Categories"
                    }
                })
            }
        }
    }
});
var goalsDataSource = new kendo.data.DataSource({
    type: "everlive",
    transport: {
        typeName: "Goals"
    }
});
// END_CUSTOM_CODE_backendServices