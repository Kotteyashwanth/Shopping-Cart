sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("project11.controller.Cart", {

        _lastDeletedItem: null,
        _lastDeletedIndex: null,

        onInit: function () {
            var oCartModel = this.getOwnerComponent().getModel("cart");

            if (!oCartModel) {
                oCartModel = new sap.ui.model.json.JSONModel({
                    cartItems: []
                });
                this.getOwnerComponent().setModel(oCartModel, "cart");
            }

            this._loadCartFromStorage();
        },

        _getCartModel: function () {
            return this.getOwnerComponent().getModel("cart");
        },

        _loadCartFromStorage: function () {
            var oModel = this._getCartModel();
            var aItems = [];

            try {
                aItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            } catch (e) {
                aItems = [];
            }

            oModel.setProperty("/cartItems", aItems);
            oModel.refresh(true);
        },

        _saveCartToStorage: function () {
            var oModel = this._getCartModel();
            var aItems = oModel.getProperty("/cartItems") || [];
            localStorage.setItem("cartItems", JSON.stringify(aItems));
        },

        onNavBack: function () {
            this.getOwnerComponent().getRouter().navTo("main");
        },

        onIncrease: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oItem = oContext.getObject();
            var oModel = oContext.getModel();

            if (oItem.Quantity < 6) {
                oItem.Quantity += 1;
            } else {
                MessageToast.show("Max 6 allowed");
                return;
            }

            oModel.refresh(true);
            this._saveCartToStorage();
        },

        onDecrease: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oItem = oContext.getObject();

            if (oItem.Quantity > 1) {
                oItem.Quantity -= 1;
                oContext.getModel().refresh(true);
                this._saveCartToStorage();
            } else {
                this.onRemove(oEvent);
            }
        },

        onRemove: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext("cart");
            var oModel = oContext.getModel();
            var aItems = oModel.getProperty("/cartItems") || [];
            var iIndex = parseInt(oContext.getPath().split("/").pop(), 10);

            this._lastDeletedItem = aItems[iIndex];
            this._lastDeletedIndex = iIndex;

            aItems.splice(iIndex, 1);

            oModel.setProperty("/cartItems", aItems);
            oModel.refresh(true);
            this._saveCartToStorage();

            this.byId("undoStrip").setVisible(true);
            MessageToast.show("Item removed");
        },

        onUndoDelete: function () {
            if (this._lastDeletedItem !== null) {
                var oModel = this._getCartModel();
                var aItems = oModel.getProperty("/cartItems") || [];

                aItems.splice(this._lastDeletedIndex, 0, this._lastDeletedItem);

                oModel.setProperty("/cartItems", aItems);
                oModel.refresh(true);
                this._saveCartToStorage();

                this.byId("undoStrip").setVisible(false);

                this._lastDeletedItem = null;
                this._lastDeletedIndex = null;

                MessageToast.show("Item restored");
            }
        },

        getDiscountRate: function (qty) {
            qty = Number(qty) || 0;

            if (qty >= 6) {
                return 0.20;
            }
            if (qty >= 3) {
                return 0.10;
            }
            return 0;
        },

        hasDiscount: function (qty) {
            qty = Number(qty) || 0;
            return qty >= 3;
        },

        getDiscountLabel: function (qty) {
            qty = Number(qty) || 0;

            if (qty >= 6) {
                return "20% OFF";
            }
            if (qty >= 3) {
                return "10% OFF";
            }
            return "";
        },

        getOriginalTotal: function (price, qty) {
            var total = (Number(price) || 0) * (Number(qty) || 0);
            return "$" + total.toFixed(2);
        },

        getDiscountedTotal: function (price, qty) {
            price = Number(price) || 0;
            qty = Number(qty) || 0;

            var original = price * qty;
            var discountRate = this.getDiscountRate(qty);
            var discounted = original - (original * discountRate);

            return "$" + discounted.toFixed(2);
        },

        getDiscountAmount: function (price, qty) {
            price = Number(price) || 0;
            qty = Number(qty) || 0;

            if (qty < 3) {
                return "";
            }

            var original = price * qty;
            var discountRate = this.getDiscountRate(qty);
            var saved = original * discountRate;

            return "$" + saved.toFixed(2);
        },

        getGrandTotal: function (items) {
            if (!items || items.length === 0) {
                return "Grand Total: $0.00";
            }

            var total = 0;

            items.forEach(function (item) {
                var price = Number(item.Price) || 0;
                var qty = Number(item.Quantity) || 0;
                var original = price * qty;
                var discountRate = qty >= 6 ? 0.20 : qty >= 3 ? 0.10 : 0;

                total += original - (original * discountRate);
            });

            return "Grand Total: $" + total.toFixed(2);
        }

    });
});