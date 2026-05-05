sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, Filter, FilterOperator, Sorter, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("project11.controller.View1", {

        onInit: function () {

            var oCartModel = this.getOwnerComponent().getModel("cart");

            if (!oCartModel) {
                oCartModel = new JSONModel({
                    cartItems: []
                });
                this.getOwnerComponent().setModel(oCartModel, "cart");
            }
        },

        onSearch: function (oEvent) {

            var sValue = oEvent.getParameter("newValue");

            var oList = this.byId("productList");
            var oBinding = oList.getBinding("items");

            var sFilterType = this.byId("filterType").getSelectedKey();

            var aFilters = [];

            if (sValue) {

                if (sFilterType === "name") {
                    aFilters.push(
                        new Filter("ProductName", FilterOperator.Contains, sValue)
                    );
                }

                if (sFilterType === "price") {
                    var fValue = parseFloat(sValue);

                    if (!isNaN(fValue)) {
                        aFilters.push(
                            new Filter("UnitPrice", FilterOperator.GE, fValue)
                        );
                    }
                }
            }

            oBinding.filter(aFilters);

            if (sFilterType === "price") {
                var oSorter = new Sorter("UnitPrice", false);
                oBinding.sort(oSorter);
            } else {
                oBinding.sort(null);
            }
        },

        onIncreaseQty: function (oEvent) {

            oEvent.cancelBubble();

            var oProduct = oEvent.getSource().getBindingContext().getObject();

            var oCartModel = this.getOwnerComponent().getModel("cart");
            var aItems = oCartModel.getProperty("/cartItems") || [];

            var oItem = aItems.find(i => i.ProductID === oProduct.ProductID);

            if (oItem) {

                if (oItem.Quantity >= 6) {
                    MessageToast.show("Max 6 allowed");
                    return; 
                }

                oItem.Quantity += 1;
            }

            else {
                aItems.push({
                    ProductID: oProduct.ProductID,
                    ProductName: oProduct.ProductName,
                    Price: oProduct.UnitPrice,
                    Quantity: 1
                });
            }

            oCartModel.setProperty("/cartItems", aItems);
            oCartModel.refresh(true);

            this.getOwnerComponent().getRouter().navTo("cart");
        },
        
        onDecreaseQty: function (oEvent) {

            oEvent.cancelBubble();

            var oProduct = oEvent.getSource().getBindingContext().getObject();

            var oCartModel = this.getOwnerComponent().getModel("cart");
            var aItems = oCartModel.getProperty("/cartItems");

            var index = aItems.findIndex(i => i.ProductID === oProduct.ProductID);

            if (index > -1) {
                if (aItems[index].Quantity > 1) {
                    aItems[index].Quantity -= 1;
                } else {
                    aItems.splice(index, 1);
                }
            }

            oCartModel.setProperty("/cartItems", aItems);
            oCartModel.refresh(true);
        },

        getQuantity: function (productId) {

            var aItems = this.getOwnerComponent()
                .getModel("cart")
                .getProperty("/cartItems") || [];

            var oItem = aItems.find(i => i.ProductID === productId);

            return oItem ? oItem.Quantity : 0;
        },

        isZeroQty: function (productId) {
            return this.getQuantity(productId) === 0;
        },

        isQtyAvailable: function (productId) {
            return this.getQuantity(productId) > 0;
        },

        getCartCount: function (aItems) {

            if (!aItems) return "0 Items";

            var total = 0;

            aItems.forEach(function (item) {
                total += item.Quantity;
            });

            return total + " Items";
        },

        getCartSummary: function (aItems) {

            if (!aItems || aItems.length === 0) return "";

            var totalQty = 0;
            var totalPrice = 0;

            aItems.forEach(function (item) {
                totalQty += item.Quantity;
                totalPrice += item.Quantity * item.Price;
            });

            return totalQty + " item  $" + totalPrice.toFixed(2);
        },

        onGoToCart: function () {
            this.getOwnerComponent().getRouter().navTo("cart");
        },

        onItemPress: function (oEvent) {

            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();

            var sProductId = oContext.getProperty("ProductID");

            this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                productId: sProductId
            });
        }

    });
});
