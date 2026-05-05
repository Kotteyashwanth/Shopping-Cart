sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("project11.controller.Detail", {

        onInit: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            var sProductId = oEvent.getParameter("arguments").productId;

            var sPath = "/Products(" + sProductId + ")";
            this.getView().bindElement(sPath);
        },

        onBack: function () {
            window.history.go(-1);
        },
       onAddToCart: function () {

    var oProduct = this.getView().getBindingContext().getObject();

    var oCartModel = this.getOwnerComponent().getModel("cart");
    var aItems = oCartModel.getProperty("/items");

    var bExists = aItems.some(function (item) {
        return item.ProductID === oProduct.ProductID;
    });

    if (!bExists) {
        aItems.push(oProduct);
    }

    oCartModel.setProperty("/items", aItems);
    
    this.getOwnerComponent().getRouter().navTo("RouteCart");
}

    });
});